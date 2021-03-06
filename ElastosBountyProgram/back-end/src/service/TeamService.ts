import Base from './Base';
import {Document, Types} from 'mongoose';
import * as _ from 'lodash';
import {validate} from '../utility';
import {constant} from '../constant';
import LogService from './LogService';
import {DataList} from './interface';

export default class extends Base {
    private model;
    private ut_model;
    protected init(){
        this.model = this.getDBModel('Team');
        this.ut_model = this.getDBModel("User_Team");
    }

    public async create(param): Promise<Document>{
        const db_team = this.getDBModel('Team');
        const db_user_team = this.getDBModel("User_Team");

        // validate
        this.validate_name(param.name);
        this.validate_type(param.type);

        const doc = {
            name : param.name,
            type : param.type,
            metadata : this.param_metadata(param.metadata),
            tags : this.param_tags(param.tags),
            profile : {
                logo : param.logo,
                description : param.description
            },
            recruiting : true,
            owner : this.currentUser._id
        };

        console.log('create team => ', doc);
        const res = await db_team.save(doc);

        // save to user team
        const doc_user_team = {
            userId : this.currentUser._id,
            teamId : res._id,
            status : constant.TEAM_USER_STATUS.NORMAL,
            role : constant.TEAM_ROLE.LEADER
        };

        console.log('create user_team => ', doc_user_team);
        const res1 = await db_user_team.save(doc_user_team);

        return res;
    }

    public async update(param): Promise<Document>{
        if(!param.id){
            throw 'invalid team id'
        }
        const db_team = this.model;
        const team_doc = await db_team.getDBInstance().findOne({_id : param.id}, {
            updatedAt: false
        });
        if(!team_doc){
            throw 'invalid team id';
        }
        if(!(this.currentUser._id.equals(team_doc.owner) || this.currentUser.role === constant.USER_ROLE.ADMIN)){
            throw 'no permission to operate';
        }

        const doc = _.merge(team_doc, {
            name : param.name,
            type : param.type,
            metadata : this.param_metadata(param.metadata),
            tags : this.param_tags(param.tags),
            profile : {
                logo : param.logo,
                description : param.description
            },
            recruiting : param.recruiting
        });

        // validate
        this.validate_name(doc.name);
        this.validate_type(doc.type);

        console.log('update team =>', doc);
        const res = await db_team.update({_id: param.id}, doc);
        if(res.ok){
            return doc;
        }

        return res;
    }

    /*
    * member apply to add a team
    *
    * */
    public async applyToAddTeam(param): Promise<boolean>{
        const {teamId, reason} = param;

        const team_doc = await this.model.findOne({_id : teamId});
        if(!team_doc){
            throw 'invalid team id';
        }

        const tmp = await this.ut_model.findOne({
            userId : this.currentUser._id,
            teamId
        });
        if(tmp){
            if(tmp.status === constant.TEAM_USER_STATUS.PENDING){
                throw 'user applied team before';
            }
            if(tmp.status === constant.TEAM_USER_STATUS.NORMAL){
                throw 'user already in team';
            }
            else{
                // reject
                throw 'team reject this member';

                // remove record first
                // await db_user_team.remove({
                //     userId : this.currentUser._id,
                //     teamId
                // });
            }
        }

        const doc = {
            userId : this.currentUser._id,
            teamId,
            level : '',
            role : constant.TEAM_ROLE.MEMBER,
            apply_reason: reason,
            status : constant.TEAM_USER_STATUS.PENDING
        };

        await this.ut_model.save(doc);

        // add log
        const logService = this.getService(LogService);
        await logService.applyToAddTeam(teamId, this.currentUser._id, reason);

        return true;
    }

    /*
    * only team owner or admin accept the apply request
    * */
    public async acceptApply(param): Promise<Document>{
        const {teamId, userId, action} = param;

        const team_doc = await this.model.findOne({_id : teamId});
        if(!team_doc){
            throw 'invalid team id';
        }

        // check current user is admin or team owner
        if(!(this.currentUser._id.equals(team_doc.owner) || this.currentUser.role === constant.USER_ROLE.ADMIN)){
            throw 'no permission to operate';
        }

        const ut_doc = await this.ut_model.findOne({teamId, userId});
        if(!ut_doc || ut_doc.status !== constant.TEAM_USER_STATUS.PENDING){
            throw 'invalid params';
        }

        const count = await this.ut_model.count({
            teamId,
            status : constant.TEAM_USER_STATUS.NORMAL
        });
        if(count+1 > team_doc.memberLimit){
            throw 'member count touch the limitation';
        }

        return await this.ut_model.update({teamId, userId}, {
            status : constant.TEAM_USER_STATUS.NORMAL
        });
    }

    /*
    * only team owner or admin reject the apply request
    *
    * */
    public async rejectApply(param): Promise<Document>{
        const {teamId, userId, action} = param;

        const team_doc = await this.model.findOne({_id : teamId});
        if(!team_doc){
            throw 'invalid team id';
        }

        // check current user is admin or team owner
        if(!(this.currentUser._id.equals(team_doc.owner) || this.currentUser.role === constant.USER_ROLE.ADMIN)){
            throw 'no permission to operate';
        }

        const ut_doc = await this.ut_model.findOne({teamId, userId});
        if(!ut_doc || ut_doc.status !== constant.TEAM_USER_STATUS.PENDING){
            throw 'invalid params';
        }

        return await this.ut_model.update({teamId, userId}, {
            status : constant.TEAM_USER_STATUS.REJECT
        });
    }

    /*
    * get whole team data
    * include all of members
    *
    * */
    public async getWholeData(param): Promise<Document>{
        const {teamId, status} = param;

        const team_doc = await this.model.findOne({_id : teamId});

        const aggregate = this.ut_model.getAggregate();
        const query: any = {
            teamId : Types.ObjectId(teamId)
        };
        if(_.includes(constant.TEAM_USER_STATUS, status)){
            query.status = status;
        }
        const rs = await aggregate.match(query)
            .lookup({
                from : 'users',
                localField : 'userId',
                foreignField : '_id',
                as : 'user'
            })
            .unwind('$user')
            .project({
                'user.password' : 0,
                'user.salt' : 0
            });

        const data = team_doc.toJSON();
        data.members = rs;
        return data;
    }

    /*
    * list teams
    *
    * */
    public async list(param): Promise<DataList>{

        // this should be documented
        const limit = param.limit || 10;

        // TODO add filter
        const query:any = {};

        if (param.owner) {
            query.owner = param.owner
        }

        if (param.archived) {
            query.archived = param.archived
        }

        // get all teams that include the userId val of teamHasUser
        if (param.teamHasUser && param.teamHasUser.length === 24) {
            const userTeams = await this.ut_model.find({
                userId: param.teamHasUser
            })

            query._id = {$in: _.map(userTeams, 'teamId')}
        }

        const count = await this.model.count(query);
        const list = await this.model.list(query, {
            updateAt: -1
        }, limit);

        // TODO add page and pageSize

        return {
            total : count,
            list,
            pageSize : limit
        }
    }

    public async listMember(param): Promise<Document[]>{
        const {teamId} = param;
        const db_team = this.getDBModel('Team');
        const aggregate = db_team.getAggregate();

        const rs = await aggregate.match({_id : Types.ObjectId(teamId)})
            .unwind('$members')
            .lookup({
                from : 'users',
                localField : 'members.userId',
                foreignField : '_id',
                as : 'members.user'
            })
            .unwind('$members.user')
            .group({
                _id : '$_id',
                list : {
                    $push : '$members'
                }
            })
            .project({'list.user.password' : 0, 'list._id' : 0});

        return rs[0].list;
    }

    public validate_name(name){
        if(!validate.valid_string(name, 4)){
            throw 'invalid team name';
        }
    }
    public param_metadata(meta: string){
        const rs = {};
        if(meta){
            const list = meta.split(',');

            _.each(list, (str)=>{
                const tmp = str.split('|');
                if(tmp.length === 2){
                    rs[tmp[0]] = tmp[1];
                }
            });
        }
        return rs;
    }
    public param_tags(tags: string){
        let rs = [];
        if(tags){
            rs = tags.split(',');
        }
        return rs;
    }
    public validate_type(type){
        if(!type || !_.includes(constant.TEAM_TYPE, type)){
            throw 'invalid team type';
        }
    }
}
