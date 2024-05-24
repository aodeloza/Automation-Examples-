'use strict'

const BasePage = require(`@pageobject/BasePage`)
const SettingsPage = require(`@pageobjectmobile/SettingsPage`)
const ConversationPage = require(`@pageobjectmobile/ConversationPage`)
const RolesPage = require(`@pageobjectmobile/RolesPage`)
const Navigator = require(`@pageobjectmobile/Navigator`)
const NewConversation = require(`@pageobjectmobile/NewConversationModal`)
const mobileGestures =  require(`@helper/mobile-gestures`)
// const SettingsPanelPageSelectors = require(`@selectormobile/SettingsPanelPages`) // for commented code
const MessengerHomePageSelector = require(`@selectormobile/MessengerHome`)

const settingsPage = new SettingsPage()
const conversationPage = new ConversationPage()
const rolesPage = new RolesPage()
const navigator = new Navigator()
const newConversation = new NewConversation()
// const settingsPanelPageSelectors = new SettingsPanelPageSelectors() // for commented code below
const msgrHomePageSelectors = new MessengerHomePageSelector()


class MessengerHomePage extends BasePage {

    /**
     * Method to open an Existing Conversation
     * @param conversationTitle {string}
     * @returns {MessengerHomePage}
     */
    async openExistingConversationInRosterTile(conversationTitle) {
        await this.clickElement(msgrHomePageSelectors.conversationTile(conversationTitle))
        return this
    }

    /**
     * Method to wait for created conversation
     * @param userName {string}
     * @returns {Boolean}
     */
    async waitAutoFwdConversation(userName) {
        await this.elementIsPresent(msgrHomePageSelectors.conversationTileText2(userName), true, 3000)
        return this
    }


    /**
     * Method to open an existing Patient conversation
     * @param conversationTitle {string}
     * @returns {MessengerHomePage}
     */
    async openExistingPatientConversationInRosterTile(conversationTitle) {
        await this.clickElement(await msgrHomePageSelectors.patientConversationTile(conversationTitle))
        return this
    }

    /**
     * New function that only opens a FORUM conversation when we know there is one needed.
     * @param conversationTitle {string}
     * @param waitForConversationToOpen {boolean}
     * @returns {object}
     */
    async openForumConversation(conversationTitle, waitForConversationToOpen = true) {

        await this.openExistingConversationInRosterTile(conversationTitle)
        if (service === 'sauce' && waitForConversationToOpen) {
            //sometimes sauce labs is so slow it starts testing before the conversation is fully opened
            await this.waitUntil((await conversationPage.isConversationOpened()) === true
                , 5000, 'Failed For Wait For Conversation To Open')
        }
        return this
    }

    /**
     * Method to wait for first Msg in List to appear
     * @param badgeCount {string}
     * @param maxWaitTime {number}
     * @returns {MessengerHomePage}
     */
    async waitForUnreadBadges(badgeCount, maxWaitTime = 120000) {
        await this.waitForExistElement(
            await msgrHomePageSelectors.unreadBadgeCountMsgPill(badgeCount),
            maxWaitTime, // Wait for 2 Minutes
            500,
            false
            )
        return this
    }

    /**
     * Method to Wait for Auto-Forward text to appear
     * @param userName {string}
     * @return {Promise<void>}
     */
    async waitForAutoForwardText(userName){
        await this.waitForExistElement(
            await msgrHomePageSelectors.roleAutoForwardText(userName),
            15000,
            500,
        )
    }

    /**
     * Method to verify Tile Presents in Roster
     * @param userName
     * @param expect
     * @return {Promise<*>}
     */
    async verifyMsgTilePresents(userName, expect){
        return await this.elementIsPresent(await msgrHomePageSelectors.tigerPageMsgTile(userName), expect, 5000)
    }

    /**
     * Method to wait for first Msg in List to appear
     * @param userName {string}
     * @param maxWaitTime {number}
     * @returns {MessengerHomePage}
     */
    async waitForFirstMsgInList(userName, maxWaitTime = 10000) {
        await (await msgrHomePageSelectors.tigerPageMsgTile(userName)
        ).waitForExist({
            timeout: maxWaitTime,
            interval: 500,
            reverse: false,
            timeoutMsg: `${userName} not present after ${maxWaitTime} ms`
        })
        return this
    }

    /**
     * Method to wait for first Msg in List to appear
     * @param msgBody {string}
     * @param maxWaitTime {number}
     * @param msgVisible {boolean}
     * @returns {WebdriverIO.Element}
     */
    async waitForMsgInConversation(msgBody, maxWaitTime = 90000, msgVisible = true) {
        await (await msgrHomePageSelectors.tigerPageMsgTile(msgBody)
        ).waitForExist({
            timeout: maxWaitTime,
            interval: 500,
            reverse: !msgVisible,
            timeoutMsg: `${msgBody} not present after ${maxWaitTime} ms`
        })
        return this
    }

    /**
     * Method to wait for a badge count to appear
     * @param msgCount {string}
     * @return {Promise<void>}
     */
    async waitForBadgeCount(msgCount){
        await this.waitForExistElement(
            await msgrHomePageSelectors.badgeCount(msgCount),
            60000,
            500
        )
    }

    /**
     * Method to verify a specific badge count is present
     * @param msgCount {string}
     * @param expect {boolean}
     * @return {Promise<boolean>}
     */
    async verifyMsgBadgeCount(msgCount, expect = true){
        return await this.elementIsPresent(await msgrHomePageSelectors.badgeCount(msgCount), expect, 5000, false)
    }

    /**
     * Method to open a tiger page conversation
     * @param userName {string}
     * @returns {MessengerHomePage}
     */
    async openTigerPageConversation(userName) {
        await this.clickElement(msgrHomePageSelectors.tigerPageMsgTile(userName))
        return this
    }

    /**
     * New function that only opens a conversation when we know there is one needed.
     * @param conversationTitle {string}
     * @returns {MessengerHomePage}
     */
    async openConversation(conversationTitle) {
        await this.openExistingPatientConversationInRosterTile(conversationTitle)
        return this
    }

    /**
     * Method to refresh the Msgr Home screen
     * @return {Promise<void>}
     */
    async refreshMsgrHome() {
        await (await this.mobileGesture()).swipeDown(1)
    }

    /**
     * Method to open a new conversation in Msgr Home Tile
     * @param msgTitle
     * @return {Promise<void>}
     */
    async openNewConversation(msgTitle){
        await this.clickElement(await msgrHomePageSelectors.msgTileTitle(msgTitle))
    }

    /**
     * Method to verify a Group Avatar is Displayed
     * @returns {WebdriverIO.Element}
     */
    async isGroupPhotoDisplayed() {
        return this.elementIsPresent(await msgrHomePageSelectors.photoTakenElement(), true)
    }

    /**
     * Method to open an existing conversation
     * @param conversationTitle {string}
     * @param waitForConversationToOpen {boolean}
     * @param isPatientSide {boolean}
     * @returns {MessengerHomePage}
     */
    async openExistingConversation(conversationTitle, waitForConversationToOpen = true, isPatientSide = false) {

        if ((await conversationPage.isConversationOpened()) === false) {
            await conversationPage.navigateBackToMessengerHomePage()
            await mobileGestures.swipeDown()
            if(platform === 'iOS' && isPatientSide === false) {
                await navigator.navigateToPage(enums.mobileAppPage.SETTINGS)
                await navigator.navigateToPage(enums.mobileAppPage.INBOX)
            }

            if(isPatientSide) {
                await mobileGestures.scrollUntilElementIsDisplayed(msgrHomePageSelectors.patientConversationTile(conversationTitle), 5, 'down')

                if (await this.elementIsPresent(msgrHomePageSelectors.patientConversationTile(conversationTitle), true, 3000, true)) {
                    await this.openExistingPatientConversationInRosterTile(conversationTitle)
                } else {
                    await navigator.clickPlusButton(enums.mobileNewConversationTypes.INDIVIDUAL)
                    await newConversation.composeNewMessage(conversationTitle)
                }
            } else {
                await mobileGestures.scrollUntilElementIsDisplayed(msgrHomePageSelectors.conversationTile(conversationTitle), 5, 'down')

                if (await this.elementIsPresent(msgrHomePageSelectors.conversationTile(conversationTitle), true, 3000, true)) {
                    await this.openExistingConversationInRosterTile(conversationTitle)
                } else {
                    await navigator.clickPlusButton(enums.mobileNewConversationTypes.INDIVIDUAL)
                    await newConversation.composeNewMessage(conversationTitle)
                }
            }

            if (service === 'sauce' && waitForConversationToOpen) {
                //sometimes sauce labs is so slow it starts testing before the conversation is fully opened
                await this.waitUntil((await conversationPage.isConversationOpened()) === true
                    , 5000, 'Failed For Wait For Conversation To Open')
            }
        }
        await mobileGestures.swipeUp()
        return this
    }

    /**
     * Method to Verify if conversation is displayed by msg
     * @param message {string}
     * @param expect {boolean}
     * @returns {WebdriverIO.Element}
     */
    async conversationTilePresentByDisplayedMessage(message,expect = true) {
        return await this.elementIsPresent(await msgrHomePageSelectors.conversationTileDisplayedMessage(message), expect, 3000, false)
    }

    /**
     * Method to verify if Conversation tile is present
     * @param userDisplayName {string}
     * @param expect {boolean}
     * @returns {WebdriverIO.Element}
     */
    async conversationTilePresent(userDisplayName, expect = true) {
        return this.elementIsPresent(await msgrHomePageSelectors.conversationTile(userDisplayName), expect, 3000, true)
    }

    /**
     * Method to verify if Forward group tile is present
     * @param userDisplayName {string}
     * @param expect {boolean}
     * @returns {Promise<WebdriverIO.Element>}
     */
    async forwardGroupTilePresent(userDisplayName, expect) {
        return await this.elementIsPresent(await msgrHomePageSelectors.forwardGroupTile(userDisplayName), expect, 2000, false)
    }

    /**
     * Function to verify Conversation Tile Text
     * @param textDisplayed {string}
     * @param expect {boolean}
     * @returns {WebdriverIO.Element}
     */
    async conversationTileTextPresent(textDisplayed, expect = true) {
        return await this.elementIsPresent(await msgrHomePageSelectors.conversationTileText(textDisplayed), expect, 3000, false)
    }

    /**
     * Method to verify Conversation Tile Text Contains
     * @param textDisplayed {text}
     * @param expect {boolean}
     * @return {Promise<*>}
     */
    async conversationTileContains(textDisplayed, expect = true){
        return await this.elementIsPresent(await msgrHomePageSelectors.conversationTileContainsText(textDisplayed), expect, 3000, false)
    }

    async conversationTilePresentPatientBroadcast(userDisplayName, expect) {
        return await this.elementIsPresent(await msgrHomePageSelectors.patientConversationTileBroadcast(userDisplayName), expect, 5000, false)
    }

    /**
     * Method that waits for the Escalation Tile to exist
     * @param tileName
     * @param timeLimit
     * @return {Promise<MessengerHomePage>}
     */
    async waitForEscTile(tileName, timeLimit = 90000){
        await this.waitForExistElement(
            await msgrHomePageSelectors.escalationTile(tileName),
            timeLimit,
            500
        )
        // await this.waitForExistElement(await msgrHomePageSelectors.escalationTile(tileName), timeLimit)
        return this
    }

    async goToRolesPage() {
        await this.clickElement(msgrHomePageSelectors.rolesIcon())
        return rolesPage
    }

    async goToSettingsPage() {
        await this.clickElement(msgrHomePageSelectors.settingsIcon())
        return settingsPage
    }

    /**
     * Method to get the value of unread msgs
     * @param tileName
     * @returns {Promise<*>}
     */
    async getUnreadMsgCount(tileName) {
        return this.mobileGetElementValue(await msgrHomePageSelectors.unreadCountByTile(tileName))
    }

    async getUnreadMessagesCountByTile(tileName, expect) {
        expect = expect.toString() || expect
        try {
            await this.waitUntil( (await this.mobileGetElementValue(msgrHomePageSelectors.unreadCountByTile(tileName))) === expect
            , 5000, 'Failed To Wait For Number Of Badge Count To Match Expected Count')
        } catch (e) {
            console.log('Unable to get expected unread message count with exception ', e.toString())
            await this.takeScreenShot()
        }
        return this.mobileGetElementValue(await msgrHomePageSelectors.unreadCountByTile(tileName))
    }

    /**
     * getUnreadMessagesCountByTileForPatient- get unread message count by tile for patient
     * @param patientName
     * @param badgeCnt
     * @returns {Promise<WebdriverIO.Element>}
     */
    async getUnreadMessagesCountByTileForPatient(patientName, badgeCnt) {
        if (platform === 'android') {
            return await this.mobileGetElementValue(await msgrHomePageSelectors.unreadCountByTilePatient(patientName, badgeCnt))
        } else {
            return await this.elementIsPresent(await msgrHomePageSelectors.unreadCountByTilePatient(patientName, badgeCnt), true, 3000, false)
        }
    }

    /**
     * Check if unread badge count is present on a tile
     * @param {string} tileName
     * @returns {boolean}
     */
    async unreadMessageBadgeCountPresent(tileName) {
        if (platform === 'iOS') {
        return this.elementIsPresent(await msgrHomePageSelectors.unreadCountP2P(tileName), true)
        } else{
            return this.elementIsPresent(await msgrHomePageSelectors.unreadCountP2P(), true)
        }
    }

    /**
     * getOnDutyBannerText- get on duty banner text
     * @param expectedText
     * @returns {string}
     */
    async getOnDutyBannerText(expectedText) {
        await this.waitForElementToBeDisplayed(msgrHomePageSelectors.onDutyBanner(), 5000)
        try {
            await this.waitUntil((await (await msgrHomePageSelectors.onDutyBanner()).getText()).includes(expectedText) === true
            , 3000, 'Unable to get on duty banner text within 3s')
        } catch (e) {
            console.log('Unable to get on duty banner text with exception ', e.toString())
        }
        return (await msgrHomePageSelectors.onDutyBanner()).getText()
    }

    async openConversationTileMenu(tileName) {
        if(platform === 'android') {
            await this.pressAndHoldElement(msgrHomePageSelectors.conversationTile(tileName), 2000)
        } else {
            await this.getCallOptionFromExistingConversation(tileName)
        }

        return this
    }

    /**
     * Method to verify Member Count on Group Msgs on Msg Tile
     * @param countText
     * @return {Promise<*>}
     */
    async verifyMemberCntDisplayed(countText){
        return await this.elementIsPresent(await msgrHomePageSelectors.memberCountText(countText),true, 3000, false)
    }

    async getPatientInfo(patient) {
        return this.mobileGetElementValue(await msgrHomePageSelectors.patientInfoDetails(patient))
    }

    async longPressPhoneButtonIsDisplayed(contactName) {
        return this.elementIsPresent(await msgrHomePageSelectors.longPressConversationFloatingMenuCallButton(contactName), true, 2000, true)
    }

    async clickLongPressMarkAllAsReadButton() {
        if(platform === 'android') {
            await this.clickElement(await msgrHomePageSelectors.longPressMarkAllAsReadButton())
        }
        return this
    }

    /**
     * Method to Click on the Mute Msg Button
     * @return {Promise<void>}
     */
    async clickLongPressMute(){
        await this.clickElement(await msgrHomePageSelectors.muteConversation())
    }

    async getRoleMessagesBadgeCount(userName, roleName, unreadMessageCount, expected) {
        return await this.elementIsPresent(await msgrHomePageSelectors.roleConversationTileUnreadMessageCount(userName,
            roleName, unreadMessageCount), expected, 5000)
    }

    async denyEnableCallerIdPopUp() {
        if (platform === 'android') {
            if (await this.elementIsPresent(await msgrHomePageSelectors.negaiveToCallerIdAlert(), true)) {
                await this.clickElementOnlyIfExists(await msgrHomePageSelectors.negaiveToCallerIdAlert())
                return this.clickElementOnlyIfExists(await msgrHomePageSelectors.enableCallerIdOkButton())
            }
        }
    }

    /**
     * Method to verify Network Switch Unread Badges
     * @param badgecnt
     * @param expect
     * @return {Promise<*>}
     */
    async verifyNetworkSwitchUnreadBadge(badgecnt, expect) {
        return this.elementIsPresent(await msgrHomePageSelectors.networkSwitchUnreadBadge(badgecnt), expect, 3000, false)
    }

    /**
     * Methos to verify Org Dropdown Badge Count
     * @param orgName
     * @param count
     * @param expect
     * @return {Promise<*>}
     */
    async verifyOrgDropDownUnreadBadgeCount(orgName, count, expect = true) {
        return await this.elementIsPresent(await msgrHomePageSelectors.orgDropDownUnreadBadgeCount(orgName, count), expect, 3000, false)
    }

    async getCallOptionFromExistingConversation(userDisplayName) {
        await this.moveElementTo('-100', '263', msgrHomePageSelectors.patientTileName(userDisplayName))
        return this
    }

    //========== Patient Scheduling ==========//
    async selectPatientTab(tabName) {
        await this.clickElementOnlyIfExists(msgrHomePageSelectors.patientTabs(tabName), 10000)
        return this
    }

    /**
     * Select Patient tab without wait for element is present since click is click only if Exists.
     * @param tabName
     * @returns {MessengerHomePage}
     */
    async selectPatientTabSmoke(tabName) {
        await this.clickElement(await msgrHomePageSelectors.patientTabs(tabName))
        return this
    }

    /**
     * Method to verify Success Popup Dismisses
     * @returns {Promise<WebdriverIO.Element>}
     */
    async waitForSuccessDismiss() {
        await this.waitForExistElement(
            await msgrHomePageSelectors.successPopup(),
            10000,
            1000,
            true
        )
    }

    async clickScheduledMessagePills(pillName) {
        await this.clickElement(msgrHomePageSelectors.scheduledMessageTabPills(pillName))
        return this
    }

    /**
     * Method to verify Repeat Msg Options
     * @param occurrence {string}
     * @returns {WebdriverIO.Element}
     */
    async isRepeatMsgOptionDisplayed(occurrence){
        return await this.elementIsPresent(msgrHomePageSelectors.repeatMsgOption(occurrence),true, 5000, false)
    }

    /**
     * Method to verify Scheduled Msg Displayed
     * @param displayName
     * @param expect
     * @returns {WebdriverIO.Element}
     */
    async isScheduledMessageTileDisplayed(displayName, expect = true) {
        return this.elementIsPresent(await msgrHomePageSelectors.scheduledMessageTileDisplayName(displayName), expect, 4000, false)
    }

    /**
     * Method to wait for the Scheduled Msg Tile to appear
     * @param displayName
     * @returns {Promise<WebdriverIO.Element>}
     */
    async waitForScheduledMsgTile(displayName){
        await this.waitForExistElement(
            await msgrHomePageSelectors.scheduledMessageTileDisplayName(displayName),
            30000,
            500,
            false
        )
    }

    /**
     * Method to verify Scheduled Msg displayName is Displayed
     * @param displayName
     * @returns {Promise<*>}
     */
    async verifyScheduledMsgDisplayed(displayName){
        return this.elementIsPresent(await msgrHomePageSelectors.scheduledMsgDisplayName(displayName), true, 4000, false)
    }

    /**
     * Method to verify Msg is Scheduled
     * @returns {Promise<*>}
     */
    async verifyMsgScheduled() {
        return await this.elementIsPresent(await msgrHomePageSelectors.msgScheduledText(), true, 3000, false)
    }

    async isSentDeliveredStatusDisplayed(displayName, status) {
        return this.elementIsPresent(await msgrHomePageSelectors.scheduledMessageStatus(displayName, status), true, 5000, true)
    }

    async clickOnScheduledMessageTile(displayName) {
        await this.clickElement(msgrHomePageSelectors.scheduledMessageTileDisplayName(displayName))
        return this
    }

    async clickLongPressDeleteButton() {
        await this.clickElement(msgrHomePageSelectors.longPressDeleteButton())
        return this
    }

    /**
     * Method to click the Cancel Delete Msg Button
     * @return {Promise<void>}
     */
    async clickCancelDelete(){
        await this.clickElement(msgrHomePageSelectors.cancelDeleteBtn())
    }

    /**
     * Method to Click the Yes Delete Msg Button
     * @return {Promise<void>}
     */
    async clickYesDelete(){
        await this.clickElement(msgrHomePageSelectors.yesDeleteBtn())
    }

    async isRepeatMessageTileDisplayName(displayName, occurrence) {
        return this.elementIsPresent(await msgrHomePageSelectors.repeatMessageTileDisplayName(displayName, occurrence), true, 5000, true)
    }

    /**
     * isForumVisible - checks if forum displayed on main messenger page
     * @param forumName
     * @returns {WebdriverIO.Element}
     */
    async isForumVisible(forumName) {
        return this.elementIsPresent(await msgrHomePageSelectors.forumElement(forumName), true)
    }

    /**
     * userPresenceDisplayed - check which user presence indicator is displayed
     * @param presence
     * @returns {MessengerHomePage}
     */
    async userPresenceDisplayed(presence) {
        await this.waitForElementToBeDisplayed(msgrHomePageSelectors.userPresence(presence))
        return this.elementIsPresent(await msgrHomePageSelectors.userPresence(presence),true)
    }

    /**
     * expectedGroupPresent - verifies multiple groups are present
     * @param groupNames {array}
     * @returns {boolean}
     */
    async expectedGroupPresent(groupNames) {
        let allPresent = true
        for (let groupName of groupNames) {
            groupName = groupName.name || groupName
            if ((await this.elementIsPresent(msgrHomePageSelectors.groupName(groupName), true)) === false) {
                await mobileGestures.swipeUp(1)
            }
            try {
                await mobileGestures.checkIfDisplayedWithScrollDown(msgrHomePageSelectors.groupName(groupName), 2)
            }
            catch (e) {
            }
            if ((await this.elementIsPresent(msgrHomePageSelectors.groupName(groupName), true)) === false) {
                await mobileGestures.swipeDown(1)
            }
            try {
                await mobileGestures.checkIfDisplayedWithScrollUp(msgrHomePageSelectors.groupName(groupName), 2)
            }
            catch (e) {
            }
            if ((await this.elementIsPresent(msgrHomePageSelectors.groupName(groupName), true)) === false) {
                console.log('Cannot find role: ' + groupName)
                allPresent = false
            }
        }

        return allPresent
    }

    /**
     * isGroupMessagePreviewDisplayed - checks if the message preview is displayed
     * @param {string} groupName
     * @param {string} messageContent
     * @returns {boolean}
     */
    async isGroupMessagePreviewDisplayed(groupName, messageContent) {
        return this.elementIsPresent(await msgrHomePageSelectors.groupConversationPreview(groupName, messageContent), true, 2000)
    }

    /**
     * isDeliveredSentMessageStatusDisplayed - checks sent msg status
     * @param {string} onDutyRoleName - user that sent the message
     * @param {string} messageContent - message content
     * @returns {boolean}
     */
    async isMessageFromRoleDisplayed(onDutyRoleName, messageContent) {
        return this.elementIsPresent(await msgrHomePageSelectors.deliveredSentMessageStatus(onDutyRoleName, messageContent), true, 2000)
    }

    /**
     * isOnDutyTextFromSettingsDisplayed - checks if on duty text is displayed from conversation details
     * @param roleName
     * @returns {*}
     */
    async isOnDutyTextFromSettingsDisplayed(roleName) {
        await mobileGestures.scrollUntilElementIsDisplayed(msgrHomePageSelectors.onDutyTextFromSettings(roleName), 3, 'down')

        return this.elementIsPresent(await msgrHomePageSelectors.onDutyTextFromSettings(roleName), true, 2000)
    }

    /**
     * isConversationDetailsIconDisplayed - checks if conv details is displayed
     * @returns {WebdriverIO.Element}
     */
    async isConversationDetailsIconDisplayed() {
        return this.elementIsPresent(await msgrHomePageSelectors.conversationDetails(), true, 2000)
    }

    /**
     * openConversationSettings - opens conversation settings
     * @param conversationTitle
     */
    async openConversationSettings(conversationTitle) {
        if((await this.isConversationDetailsIconDisplayed()) === false){
            await this.openExistingConversationInRosterTile(conversationTitle)
        }
        await this.clickElement(msgrHomePageSelectors.conversationDetails(), 2000)
        return this.clickElement(await msgrHomePageSelectors.conversationSettings(), 2000)
    }

    /**
     * goBackFromConversationSettings - closes conversation settings
     */
    async goBackFromConversationSettings() {
        return this.clickElement(await msgrHomePageSelectors.goBackFromConversationSettings(), 2000)
    }

    /**
     * xButtonToCloseConversation - closes conversation chat
     */
    async xButtonToCloseConversation() {
        return this.clickElement(await msgrHomePageSelectors.closeConversation(), 2000)
    }

    /**
     * isMessengerPageBadgeCountDisplayed - checks the messenger page badge count
     * @param {string} badgeCount
     * @returns {boolean}
     */
    async isMessengerPageBadgeCountDisplayed(badgeCount) {
        return this.elementIsPresent(await msgrHomePageSelectors.messengerPageBadgeCount(badgeCount), true, 2000)
    }

    /**
     * isMessagePresent - checks if the message present
     * @param {string} message
     * @returns {boolean}
     */
    async isMessagePresent(message) {
        await mobileGestures.scrollUntilElementIsDisplayed(msgrHomePageSelectors.messageContent(message), 3, 'down')

        return this.elementIsPresent(await msgrHomePageSelectors.messageContent(message), true, 2000)
    }

    /**
     * isSendingAsRoleTextDisplayed - checks Sending as role text in the chat
     * @param {string} roleName
     * @returns {boolean}
     */
    async isSendingAsRoleTextDisplayed(roleName) {
        return this.elementIsPresent(await msgrHomePageSelectors.sendingAsRoleText(roleName), true, 2000)
    }

    // COMMENTING OUT AND SAVING FOR POTENTIAL FUTURE USE
    // /**
    //  * clickIfEnableCallerID - if the modal to Enable Caller ID appear, the user should be action in this modal to continue the progress
    //  * @return (object)
    //  */
    // async clickIfEnableCallerID() {
    //     await this.clickElementOnlyIfExists(msgrHomePageSelectors.enableCallerIDTurnItOnAndroid(), 10000)
    //     await this.clickElementOnlyIfExists(settingsPanelPageSelectors.contactsAlertAllowButton(), 10000)
    //
    //     return this
    // }

    async appNotification(action, notificationText) {
        switch (action.toLowerCase()) {
            case "open":
                await browser.openNotifications()
                break
            case "present":
                return await this.elementIsPresent(msgrHomePageSelectors.appNotificationSelectors(notificationText), true)
            case "click":
                await this.clickElementOnlyIfExists(msgrHomePageSelectors.appNotificationSelectors(notificationText), 15000)
                break
        }
        return this
    }
}

module.exports = MessengerHomePage
