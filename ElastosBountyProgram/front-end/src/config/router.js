import HomePage from '@/module/page/home/Container'
import SocialPage from '@/module/page/social/Container'
import DeveloperPage from '@/module/page/developer/Container'
import LeaderPage from '@/module/page/leader/Container'

// this is the leaders link in the header
import DirectoryPage from '@/module/page/directory/Container'

import TeamsPage from '@/module/page/teams/Container'
import TasksPage from '@/module/page/tasks/Container'
import TaskDetailPage from '@/module/page/task_detail/Container'

import LoginPage from '@/module/page/login/Container'
import RegisterPage from '@/module/page/register/Container'

import ProfileInfoPage from '@/module/page/profile/info/Container'
import ProfileTasksPage from '@/module/page/profile/tasks/Container'
import ProfileTaskDetailPage from '@/module/page/profile/task_detail/Container'
import ProfileTeamsPage from '@/module/page/profile/teams/Container'
import ProfileSubmissionsPage from '@/module/page/profile/submissions/Container'
import ProfileCommunitiesPage from '@/module/page/profile/communities/Container'
import ProfileSubmissionDetailPage from '@/module/page/profile/submission_detail/Container'

import MemberPage from '@/module/page/member/Container'

import AdminUsersPage from '@/module/page/admin/users/Container'
import AdminProfileDetailPage from '@/module/page/admin/profile_detail/Container'
import AdminTasksPage from '@/module/page/admin/tasks/Container'
import AdminTaskDetailPage from '@/module/page/admin/task_detail/Container'
import AdminSubmissionsPage from '@/module/page/admin/submissions/Container'
import AdminSubmissionDetailPage from '@/module/page/admin/submission_detail/Container'

import CountryCommunitiesPage from '@/module/page/admin/community/CountryCommunities/Container'
import CommunityDetailPage from '@/module/page/admin/community/CommunityDetail/Container'

import PublicCountryCommunitiesPage from '@/module/page/community/PublicCountryCommunities/Container'
import PublicCommunityDetailPage from '@/module/page/community/PublicCommunityDetail/Container'

import TaskCreatePage from '@/module/page/task_create/Container'

// admin team page
import TeamListPage from '../module/page/admin/teams/TeamListPage';

import NotFound from '@/module/page/error/NotFound'

export default [
    {
        path: '/',
        page: HomePage
    },
    {
        path: '/home',
        page: HomePage
    },
    {
        path: '/social',
        page: SocialPage
    },
    {
        path: '/developer',
        page: DeveloperPage
    },
    {
        path: '/developer/country/:country',
        page: DeveloperPage
    },
    {
        path: '/developer/country/:country/region/:region',
        page: DeveloperPage
    },
    {
        path: '/leader',
        page: LeaderPage
    },
    {
        path: '/directory',
        page: DirectoryPage
    },
    {
        path: '/teams',
        page: TeamsPage
    },
    {
        path: '/tasks',
        page: TasksPage
    },
    {
        path: '/task-detail/:taskId',
        page: TaskDetailPage
    },
    {
        path: '/task-create',
        page: TaskCreatePage
    },
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/register',
        page: RegisterPage
    },
    {
        path: '/profile/info',
        page: ProfileInfoPage
    },
    {
        path: '/profile/tasks',
        page: ProfileTasksPage
    },
    {
        path: '/profile/task-detail/:taskId',
        page: ProfileTaskDetailPage
    },
    {
        path: '/profile/teams',
        page: ProfileTeamsPage
    },
    {
        path: '/profile/submissions',
        page: ProfileSubmissionsPage
    },
    {
        path: '/profile/communities',
        page: ProfileCommunitiesPage
    },
    {
        path: '/profile/submission-detail/:submissionId',
        page: ProfileSubmissionDetailPage
    },
    {
        // public profile page
        path: '/member/:userId',
        page: MemberPage
    },
    {
        path: '/admin/users',
        page: AdminUsersPage
    },
    {
        path: '/admin/tasks',
        page: AdminTasksPage
    },
    {
        path: '/admin/task-detail/:taskId',
        page: AdminTaskDetailPage
    },
    {
        path: '/admin/profile/:userId',
        page: AdminProfileDetailPage
    },
    {
        path: '/admin/submissions',
        page: AdminSubmissionsPage
    },
    {
        path: '/admin/submission-detail/:submissionId',
        page: AdminSubmissionDetailPage
    },
    {
        path: '/community',
        page: PublicCountryCommunitiesPage
    },
    {
        path: '/community/country/:country',
        page: PublicCountryCommunitiesPage
    },
    {
        path: '/community/:community/country/:country',
        page: PublicCommunityDetailPage
    },
    {
        path: '/community/:community/country/:country/region/:region',
        page: PublicCommunityDetailPage
    },
    {
        path: '/admin/community',
        page: CountryCommunitiesPage
    },
    {
        path: '/admin/community/country/:country',
        page: CountryCommunitiesPage
    },
    {
        path: '/admin/community/:community/country/:country',
        page: CommunityDetailPage
    },
    {
        path: '/admin/community/:community/country/:country/region/:region',
        page: CommunityDetailPage
    },

    // admin team page
    {
        path : '/admin/teams',
        page : TeamListPage
    },

    {
        page: NotFound
    }
]
