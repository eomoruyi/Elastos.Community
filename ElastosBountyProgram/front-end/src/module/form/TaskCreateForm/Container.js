import {createContainer, goPath} from "@/util";
import Component from './Component';
import TaskService from '@/service/TaskService';
import {message} from 'antd';

message.config({
    top: 100
})


export default createContainer(Component, (state)=>{
    return {
        is_admin: state.user.is_admin
    };
}, ()=>{
    const taskService = new TaskService();

    return {
        async createTask(formData){

            try {
                const rs = await taskService.create({
                    name: formData.taskName,
                    category: formData.taskCategory,
                    type: formData.taskType,
                    description: formData.taskDesc,
                    candidateLimit: formData.taskCandLimit
                });

                if (rs) {
                    message.success('task created successfully');
                    taskService.path.push('/home');
                }
            } catch (err) {
                message.error('There was an error creating this task')
                console.error(err) // TODO: add rollbar?
            }
        }
    };
});