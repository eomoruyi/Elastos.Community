import {createContainer} from "@/util"
import Component from './Component'
import CommentService from '@/service/CommentService'
import TaskService from '@/service/TaskService'
import SubmissionService from '@/service/SubmissionService'
import {message} from 'antd'

export default createContainer(Component, (state) => {
    return {
        task: state.task.detail,
        submission: state.submission.detail,
        loading: state.task.loading || state.submission.loading
    }
}, () => {

    const commentService = new CommentService()
    const submissionService = new SubmissionService()
    const taskService = new TaskService()

    return {
        async postComment(type, parentId, comment) {
            try {
                const rs = await commentService.postComment(type, parentId, comment)

                if (rs) {
                    message.success('Your comment has been posted.');
                }
            } catch (err) {
                message.error(err.message)
            }
        },

        async get(type, parentId) {
            return commentService.get(type, parentId)
        },

        async getTaskDetail(taskId) {
            return taskService.get(taskId)
        },

        async resetTaskDetail() {
            return taskService.resetTaskDetail()
        },

        async getSubmissionDetail(submissionId) {
            return submissionService.get(submissionId)
        },

        async resetSubmissionDetail(submissionId) {
            return submissionService.resetSubmissionDetail()
        }
    }
})
