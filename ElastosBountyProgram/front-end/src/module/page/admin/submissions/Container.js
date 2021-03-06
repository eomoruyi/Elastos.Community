import { createContainer } from '@/util'
import Component from './Component'
import SubmissionService from '@/service/SubmissionService'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    let submissionState = state.submission

    submissionState.loading = false

    if (!_.isArray(state.submission.all_submissions)) {
        submissionState.all_submissions = _.values(state.submission.all_submissions)
    }

    submissionState.filter = state.submission.filter || {}

    return submissionState

}, () => {

    const submissionService = new SubmissionService()

    return {
        async getSubmissions () {
            return submissionService.index({
                admin: true
            })
        },

        async resetSubmissions () {
            return submissionService.resetAllSubmissions()
        },

        async setFilter(options) {

        }
    }
})
