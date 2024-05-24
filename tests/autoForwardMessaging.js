'use strict'

const MobileUtils = require(`@helper/MobileUtils`)
const Navigator = require(`@pageobjectmobile/Navigator`)
const utils = require(`@helper/utils`)
const userApi = require(`@serverapi/user`)
const orgApi = require(`@serverapi/org`)
const rolesApi = require(`@serverapi/roles`)
const SettingsPage = require(`@pageobject/mobile/SettingsPage`)
const premiumOrgUpdate = require(`@helper/premiumOrgUpdateTemplates`)
const enums = require(`@helper/enums`)
const AvailableOptions = require(`@pageobjectmobile/AvailableOptions`)
const NewConversationModal = require(`@pageobjectmobile/NewConversationModal`)
const GetStarted = require(`@pageobjectmobile/GetStarted`)
const groupApi = require(`@serverapi/group`)
const {expect} = require("chai")
const {faker} = require("@faker-js/faker")


describe(platform + ' AutoForward Messaging - Regression Tests', () => {
    global.apiLogPrefix = platform + '_autoFwdExtendMessaging_'
    const navigator = new Navigator()
    const mobileUtils = new MobileUtils()
    const available = new AvailableOptions()
    const getStarted = new GetStarted()
    const settingsPage = new SettingsPage()
    const newConversationModal = new NewConversationModal()

    let newOrgName, orgToken, autoReplyCustomMessage, genericAutoReplyMessageText,
        user1 = {}, user2 = {}, envLoginUser = {}, newUserList = [],user3 ,
        forwardRole = {}, customUnavailableBnr, groupToken, team, teamToken, group1, forwardRole2 = {}

    // variables to track test results for dashboard
    let suiteStartTime = "", numPassedTests = 0, numFailedTests = 0

    before(async () => {
        suiteStartTime = new Date().toISOString()  // capture suite start time for dashboard
        user1 = await utils.generateNewUserDetails('_Usr1_')
        user2 = await utils.generateNewUserDetails('_Usr2_')
        user3 = await utils.generateNewUserDetails('_Usr3_')
        envLoginUser = await utils.generateNewUserDetails('_EnvUsr_')
        newUserList = [envLoginUser, user1, user2, user3]
        autoReplyCustomMessage = "Auto-Reply: I'm sorry, I am unable to reply right now."
        genericAutoReplyMessageText = "Auto-Reply: Sorry"
        customUnavailableBnr = "Away from keyboard at this time"
        forwardRole = await utils.generateRoleDetails()
        forwardRole2 = await utils.generateRoleDetails()
        group1 = (faker.commerce.department()) + ' group'

        // sets up org for the test based on env and requested parameters.
        ;[orgToken, newOrgName] = await utils.createOrg('mobileTeams')
        await orgApi.updateOrg(orgToken, TestingEnv, await premiumOrgUpdate.enableBasicDnd())

        // create users + add users to org
        for (let user of newUserList) {
            user.token = await userApi.newUser(orgToken, TestingEnv, user.displayName, user.firstName, user.lastName,
                user.email, TCpassword)
            await userApi.addUserToOrg(orgToken, TestingEnv, user.email)
        }
        await utils.addUserToUserListFile(newUserList)

        // update user roles
        await userApi.updateUserRoles(orgToken, TestingEnv, envLoginUser.token,
            enums.userPermissions.featureRoleAdmin)
        await userApi.updateUserProductRoles(orgToken, TestingEnv, envLoginUser.token, enums.userProductRoles.ttAdmin)

        // generate API creds
        const result = await userApi.genUserApiSecretsWithOrgToken(TestingEnv, envLoginUser.email, orgToken)
        envLoginUser.apiKey = await result['tt-x-api-key']
        envLoginUser.apiSecret = await result['tt-x-api-secret']

        // const user1Result = await userApi.genUserApiSecretsWithOrgToken(TestingEnv, user1.email, orgToken)
        // user1.apiKey = await user1Result['tt-x-api-key']
        // user1.apiSecret = await user1Result['tt-x-api-secret']
        //
        // const user2Result = await userApi.genUserApiSecretsWithOrgToken(TestingEnv, user2.email, orgToken)
        // user2.apiKey = await user2Result['tt-x-api-key']
        // user2.apiSecret = await user2Result['tt-x-api-secret']

        // Create Role, Team & Group for assigning Auto-Forward
        forwardRole.token = await rolesApi.newRole(TestingEnv, orgToken, envLoginUser.apiKey, envLoginUser.apiSecret,
            forwardRole.name,
            'autoForwardRole')
        forwardRole2.token = await rolesApi.newRole(TestingEnv, orgToken, envLoginUser.apiKey, envLoginUser.apiSecret,
            forwardRole2.name,
            'autoForwardRole2')

        team = await utils.generateTeamsDetails([envLoginUser.token, user1.token])
        teamToken = await groupApi.newTeam(orgToken, TestingEnv, envLoginUser.apiKey, envLoginUser.apiSecret, team.members,
            team.name, team.description, true)

        groupToken = await groupApi.newGroup(orgToken, TestingEnv, envLoginUser.apiKey, envLoginUser.apiSecret,
            [envLoginUser.email,user1.email ,user2.email], group1)
    })

    afterEach(async function () {
        // track test results for dashboard
        if (this.currentTest.state === 'passed') {
            numPassedTests++
        }
        if (this.currentTest.state === 'failed') {
            numFailedTests++
        }
    })

    after(async () => {
        // FallBack Org Cleanup
        if (newOrgName.includes('FallBack_mobile')) {
            await utils.orgCleanupData(envLoginUser.email, orgToken)
        }
        // add test results to dashboard log
        await utils.addDashboardData(
            suiteStartTime, "mobileRegression",
            platform + ' Availability in Messaging - Regression Tests',
            numPassedTests, numFailedTests)
        await userApi.cleanListOfKeys([envLoginUser.apiKey, user1.apiKey, envLoginUser.userApiKey2, user2.userApiKey2])
    })

    it(`${utils.mobileTCN('C914000', 'C914000')} verify dnd auto forward user
     to multiple user`, async function () {

        // Login using FF for now, when FF is moved to LD ORG, will remove Feature Flag section and terminateApp section.
        platform === 'android' ?
            await getStarted.turnFeatureFlagOnAnroid([enums.androidFeatureFlag.USE_WEBSOCKETS,
                enums.androidFeatureFlag.USE_WEBSOCKETS_DISABLE_SSE_FALLBACK, enums.androidFeatureFlag.AVAILABILITY, enums.androidFeatureFlag.ENABLEAUTOFORWARDEXTEND]) :
            await getStarted.turnFeatureFlagOnIOS([enums.iOSFeatureFlag.ENABLEAVAILABILITY,
                enums.iOSFeatureFlag.ENABLEAUTOFORWARDEXTEND, enums.iOSFeatureFlag.ENABLESETTINGSMODULE])
        await mobileUtils.loginSmoke(user1.email, user1.password, newOrgName)

        //open Settings Profile, Set Unavailable Time, Enable Auto-Forward, Select User to Auto-Forward
        await navigator.navigateToPage(enums.mobileAppPage.VIEW_PROFILE_TAB)
        await browser.pause(500) // Wait for Profile view to load
        await available.selectUnavailableTime('5 Min') //set unavailable time
        await browser.pause(500) // Wait for Profile view to load
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch ON Auto-Forward
        await newConversationModal.clickUserToForward(user2.displayName)//Select envLogin to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(user3.displayName)//Select User2 to Auto-Forward
        await settingsPage.clickDoneUserSelectionAutoForward()
        const verifyMultipleUser = await settingsPage.autoForwardMultipleReceipts()

        await expect([verifyMultipleUser],'Expected Multiple Users has been selected').to.eql([true])    })


    it(`${utils.mobileTCN('C914001', 'C914001')} verify dnd auto forward user to multiple roles`, async function () {
        await browser.pause(500) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch OFF Auto-Forward
        await browser.pause(500) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch ON Auto-Forward
        await browser.pause(500) // stability usage
        await newConversationModal.clickUserToForward(forwardRole.name)//Select Role to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(forwardRole2.name)//Select User to Auto-Forward
        await settingsPage.clickDoneUserSelectionAutoForward()    //Click Done

        const verifyMultipleUser = await settingsPage.autoForwardMultipleReceipts()

        await expect([verifyMultipleUser],'Expected Multiple Roles has been selected').to.eql([true])
    })

    it (`${utils.mobileTCN('C914002', 'C914002')} verify message "verify dnd auto forward user 
    to user + role `, async function () {
        await browser.pause(500) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch OFF Auto-Forward
        await browser.pause(500) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch ON Auto-Forward
        await browser.pause(500) // stability usage
        await newConversationModal.clickUserToForward(forwardRole.name)//Select Role to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(user2.displayName)//Select User to Auto-Forward
        await settingsPage.clickDoneUserSelectionAutoForward()    //Click Done

        const verifyMultipleUser = await settingsPage.autoForwardMultipleReceipts()

        // Verify Compose Msg Unavailable User Info
        await expect([verifyMultipleUser],'Expected User + Role has been selected').to.eql([true])    })

    it (`${utils.mobileTCN('C914003', 'C914003')} verify message "verify 
    dnd auto forward user to team + role `, async function () {
        await browser.pause(500) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch OFF Auto-Forward
        await browser.pause(500) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch ON Auto-Forward
        await browser.pause(500) // stability usage
        await newConversationModal.clickUserToForward(forwardRole.name)//Select Role to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(team.name)//Select team to Auto-Forward
        await settingsPage.clickDoneUserSelectionAutoForward()    //Click Done

        const verifyMultipleUser = await settingsPage.autoForwardMultipleReceipts()

        // Verify Compose Msg Unavailable User Info
        await expect([verifyMultipleUser],'Expected Roles + Team has been selected').to.eql([true])
    })

    it (`${utils.mobileTCN('C914004', 'C914004')} verify message "verify dnd auto forward 
    user to group + user `, async function () {
        await browser.pause(200) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch OFF Auto-Forward
        await browser.pause(200) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch ON Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(user3.DisplayName)//Select group to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(group1)//Select user to Auto-Forward

        await settingsPage.clickDoneUserSelectionAutoForward()    //Click Done

        const verifyMultipleUser = await settingsPage.autoForwardMultipleReceipts()

        // Verify Compose Msg Unavailable User Info
        await expect([verifyMultipleUser],'Expected User + Team has been selected').to.eql([true])
    })

    it (`${utils.mobileTCN('C914032', 'C914032')} verify dnd auto forward himself + 
    user + group `, async function () {
        await browser.pause(200) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch OFF Auto-Forward
        await browser.pause(200) // stability usage
        await settingsPage.clickAutoForwardToggleExtended("Auto forward") //Switch ON Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(user3.DisplayName)//Select Role to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(group1)//Select team to Auto-Forward
        await browser.pause(200) // stability usage
        await newConversationModal.clickUserToForward(user1.DisplayName)//Select Role to Auto-Forward
        await settingsPage.clickDoneUserSelectionAutoForward()    //Click Done

        const verifyMultipleUser = await settingsPage.autoForwardMultipleReceipts()

        // Verify Compose Msg Unavailable User Info
        await expect([verifyMultipleUser],'Expected User + group + loggedUser has been selected').to.eql([true])
    })

})
