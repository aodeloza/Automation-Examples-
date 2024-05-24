'use strict'
const BasePageSelectors = require(`@selector/BaseSelectors`)
const BasePage = require(`@pageobject/BasePage`)

const basePage = new BasePage()

class MessengerHome extends BasePageSelectors {

    /**
     * Element Definition for a conversation tile
     * @param userName
     * @returns {WebdriverIO.Element}
     */
    async conversationTile(userName) {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndResourceIdAndroid(userName, 'com.tigertext:id/display_name'),
            await this.findByContainsNameIOS(userName)
        );
    }

    async badgeCount(msgCount){
        return await basePage.getMobileSelector(
            await this.findByTextContainsAndroid(msgCount),
            await this.findByElementIOSNameValue('Messages', msgCount)
        )
    }

    async escalationTile(escId){
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(escId),
            await this.findByElementIOSPredicateLabelContains(escId)
        )
    }

    /**
     * Element definition for TigerPage Msg Tile
     * @param userName
     * @returns {WebdriverIO.Element}
     */
    async tigerPageMsgTile(userName) {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(`${userName}`),
            await this.findByElementIOSPredicateLabelContains(userName)
        )
    }

    /**
     * Element Definition for the Forward Group Tile
     * @param userName
     * @returns {WebdriverIO.Element}
     */
    async forwardGroupTile(userName) {
        return await basePage.getMobileSelector(
            await this.findByTextContainsAndroid(`${userName}`),
            await this.findByElementIOSPredicateLabelContains(userName));
    }

    async muteConversation(){
        return basePage.getMobileSelector(
            await this.findByTextAndroid('Mute'),
            await this.findByElementIOSPredicateLabel('Mute')
        )
    }

    /**
     * Mobile element selector for conversation tile text
     * @param text
     * @returns {WebdriverIO.Element}
     */
    async conversationTileText(text) {
        return basePage.getMobileSelector(
            await this.findByTextAndroid(`${text}`),
            await this.findByElementIOSPredicateLabel(`${text}`));
    }

    /**
     * Mobile element selector for conversation tile text
     * @param text
     * @returns {WebdriverIO.Element}
     */
    async conversationTileText2(text) {
        return basePage.getMobileSelector(
            await this.findByTextAndroid(`${text}`),
            await this.findByElementIOSPredicateLabel(text+',P2P Message'));
    }


    /**
     * Mobile Element selector for conversation tile contains text
     * @param text
     * @return {WebdriverIO.Element}
     */
    async conversationTileContainsText(text){
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(text),
            await this.findByElementIOSPredicateLabelContains(text)
        )
    }

    /**
     * Element Definition for an Android avatar Photo
     * @returns {WebdriverIO.Element}
     */
    async photoTakenElement() {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid('_tempimage.jpeg'),
            await this.findByElementIOSPredicateLabel('')
        );
    }

    /**
     * Element definition for patient conversation tile
     * @param userName
     * @returns {Promise<WebdriverIO.Element>}
     */
    async patientConversationTile(userName) {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(`${userName}`),
            await this.findByElementIOSPredicateLabelContains(userName)
        )
    }

    async patientConversationTileBroadcast(userName) {
        return await basePage.getMobileSelector(
            await this.findByTextContainsAndroid(userName),
            await this.findByStaticTextValueIOS(userName)
        )
    }

    async conversationTileDisplayedMessage(message) {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(message),
            await this.findByStaticContainsTextIOS(message)
        )
    }

    async settingsIcon(userFirstName) {
        return basePage.getMobileSelector(
            '~Settings',
            '~Hi, ' + userFirstName + '!')
    }

    async cancelSearch() {
        return basePage.getMobileSelector(
            "//*[@resource-id='com.tigertext:id/clearText']",
            '~Cancel')
    }

    /**
     * Element definition for Messages Badge Count
     * @param count
     * @returns {Promise<WebdriverIO.Element>}
     */
    async unreadBadgeCountMsgPill(count){
        return basePage.getMobileSelector(
            await this.findByTextAndResourceIdAndroid(count,'com.tigertext:id/unread_pill_badge'),
            await this.findByElementIOSNameValue('Messages', count)
        )
    }

    async roleAutoForwardText(userName) {
        return await basePage.getMobileSelector(
            await this.findByTextContainsAndroid(`Auto-forwarding to: ${userName}`),
            await this.findByLabel(`Auto-forwarding to: `)
        )
    }

    async unreadCountByTile(tileName) {
        return basePage.getMobileSelector(
            '//android.view.ViewGroup[@content-desc="' + tileName + '"]//android.widget.TextView[@resource-id="com.tigertext:id/new_message_org_unread_badge"]',
            '//XCUIElementTypeCell[contains(@name,"' + tileName + '")]//XCUIElementTypeStaticText[contains(@name, "Unread Messages")]')
    }

    async unreadCountByTilePatient(patient, badgeCnt) {
        return basePage.getMobileSelector(
            this.findContainContentDescAndFindResIdAndroid(`${patient} (Patient)`, 'com.tigertext:id/new_message_org_unread_badge'),
            this.findByElementTypeOtherIOS(badgeCnt)
        )
    }

    async unreadCountP2P(tileName) {
        return await basePage.getMobileSelector(
            await this.findByResourceIdAndroid('com.tigertext:id/new_message_org_unread_badge'),
            `~${tileName}, P2P Message, unread`
        )
    }

    async roleConversationTileUnreadMessageCount(userName, roleName, messageCount) {
        return await basePage.getMobileSelector(
            '//android.widget.TextView[@resource-id="com.tigertext:id/tvRole"] [@text="' + roleName + '"]' +
            '//parent::android.view.ViewGroup[@resource-id="com.tigertext:id/inbox_row_container"] [@content-desc="' + userName + '"]' +
            '//android.widget.TextView[@resource-id="com.tigertext:id/new_message_org_unread_badge"][@text="' + messageCount + '"]',
            '//XCUIElementTypeStaticText[@name="sender_role_name"] [@value="' + roleName + '"]' +
            '//parent::XCUIElementTypeCell[contains(@name, "' + userName + '")]//XCUIElementTypeStaticText[@name="' + messageCount + ' Unread Messages"]'
        )
    }

    //Android Selectors

    async longPressConversationFloatingMenuCallButton(contactName) {
        return basePage.getMobileSelector(
            await this.findByResourceIdAndroid("com.tigertext:id/longPressLabel"),
            `//*[contains(@label, "${contactName}")]/XCUIElementTypeButton[2]`
        );
    }

    async enableCallerIdOkButton() {
        return basePage.getMobileSelector(
            await this.findByResourceIdAndroid('com.tigertext:id/ok_button'),
            '');
    }

    async negaiveToCallerIdAlert() {
        return basePage.getMobileSelector(
            await this.findByResourceIdAndroid('com.tigertext:id/negative_button'),
            '');
    }

    //iOS Selectors

    async rolesIcon() {
        return basePage.getMobileSelector(
            '',
            '[name="Roles Tab"]')
    }

    /**
     * Method to verify On Duty Banner text
     * @returns {Promise<WebdriverIO.Element>}
     */
    async onDutyBanner() {
        return basePage.getMobileSelector(
            '//android.widget.TextView[contains(@text,"You\'re On Duty:")]',
            '//XCUIElementTypeStaticText[contains(@name,"You\'re On Duty:")]')
    }

    async networkSwitchUnreadBadge(badgeCnt) {
        return basePage.getMobileSelector(
            await this.findByTextAndroid(badgeCnt),
            await this.findByStaticTextIndexIOS(`${badgeCnt} Unread Messages`,1)
        )
    }

    async orgDropDownUnreadBadgeCount(orgName, badgeCnt) {
        return basePage.getMobileSelector(
            await this.findByTextAndroid(badgeCnt),
            await this.findByLabel(`${orgName}, ${badgeCnt}`)
        )
    }

    async patientTileName(patientName) {
        return basePage.getMobileSelector(
            '',
            `//XCUIElementTypeStaticText[contains(@name,"${patientName}")]`
        )
    }

    async longPressMarkAllAsReadButton() {
        return basePage.getMobileSelector(
            '//*[@resource-id="com.tigertext:id/longPressLabel" and contains(@text, "Mark all as Read")]',
            ''
        )
    }

    //============= Patient Side ==========//
    async patientTabs(tabName) {
        if (tabName === 'Inbox Tab' && platform === 'android') {
            tabName = 'Inbox'
        }
        return basePage.getMobileSelector(
            `~${tabName}`,
            await this.findByElementButtonByValueIOS(`${tabName} Tab`)
        );
    }

    /**
     * Element Definition for scheduled Msg Tile Display Name
     * @param displayName
     * @returns {Promise<WebdriverIO.Element>}
     */
    async scheduledMessageTileDisplayName(displayName) {
        return basePage.getMobileSelector(
            await this.findByTextAndResourceIdAndroid(`${displayName}`, 'com.tigertext:id/display_name'),
            await this.findByStaticTextValueContainsIOS(displayName)
        )
    }

    /**
     * Element Definition for Display Name of scheduled msg
     * @param displayName
     */
    async scheduledMsgDisplayName(displayName){
        return basePage.getMobileSelector(
            await this.findByTextAndroid(displayName),
            await this.findByStaticTextValueContainsIOS(displayName)
        )
    }

    /**
     * Element definition for scheduled text
     * @returns {Promise<WebdriverIO.Element>}
     */
    async msgScheduledText(){
        return basePage.getMobileSelector(
            await this.findByTextAndroid('Scheduled'),
            await this.findByElementIOSPredicateLabel('Scheduled')
        )
    }

    /**
     * Success Modal popup element definition
     * @returns {WebdriverIO.Element}
     */
    async successPopup() {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid('Success'),
            await this.findByNameIOS('Success Pop-up')
        )
    }

    async scheduledMessageStatus(displayName, status) {
        return basePage.getMobileSelector(
            `//*[@resource-id = "com.tigertext:id/display_name" and @text = "${displayName}"]/following-sibling::*[@text = "${status}"]`,
            `//XCUIElementTypeCell[contains(@name,"${status}") and contains(@name, "${displayName}")]`
        )
    }

    async repeatMsgOption(occurrence) {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(`${occurrence} Until `),
            await this.findByStaticContainsTextIOS(occurrence)
        )
    }

    /**
     * Element definition for repeat Msg Tile
     * @param displayName
     * @param occurrence
     * @returns {Promise<WebdriverIO.Element>}
     */
    async repeatMessageTileDisplayName(displayName, occurrence) {
        return basePage.getMobileSelector(
            `//*[@resource-id = "com.tigertext:id/display_name" and @text = '${displayName}']/following-sibling::*[@resource-id = "com.tigertext:id/message_occurrence" and contains(@text, '${occurrence}')]`,
            `//XCUIElementTypeCell[contains(@name,"${occurrence}") and contains(@name, "${displayName}")]`
        )
    }

    async longPressDeleteButton() {
        return basePage.getMobileSelector(
            await this.findByTextAndroid('Delete'),
            await this.findByElementIOSPredicateLabel('Delete')
        )
    }

    async cancelDeleteBtn(){
        return basePage.getMobileSelector(
            await this.findByTextAndroid('Cancel'),
            await this.findByElementIOSPredicateLabel('Cancel')
        )
    }

    async yesDeleteBtn(){
        return basePage.getMobileSelector(
            await this.findByTextAndroid('Yes'),
            await this.findByElementIOSPredicateLabel('Yes')
        )
    }

    async msgTileTitle(msgTileText) {
        return basePage.getMobileSelector(
            await this.findByTextAndroid(msgTileText),
            await this.findByElementIOSPredicateLabelContains(`${msgTileText},`)
        )
    }

    async scheduledMessageTabPills(pillName) {
        return basePage.getMobileSelector(
            await this.findByTextContainsAndroid(pillName),
            await this.findByElementIOSPredicateLabelContains(pillName)
        );
    }

    async memberCountText(count) {
        return basePage.getMobileSelector(
            await this.findByTextAndroid(`${count} Members`),
            await this.findByElementIOSPredicateLabel(`${count} Members`)
        )
    }

    async patientInfoDetails(patient) {
        return basePage.getMobileSelector(
            `//*[@resource-id ="com.tigertext:id/display_name" and @text ="${patient}"]/following-sibling::*[@resource-id ="com.tigertext:id/patient_info"]`,
            `//XCUIElementTypeStaticText[@name="${patient}"]/following-sibling::*[contains(@name, "|")]`
        )
    }

    async forumElement(forumName) {
        return basePage.getMobileSelector(
            `(//android.view.ViewGroup[@content-desc="${forumName}"])[1]/android.widget.TextView[2]`,
            `//XCUIElementTypeCell[contains(@name, "${forumName}")]`
        )
    }

    async userPresence(presence) {
        return basePage.getMobileSelector(
            `//*[@content-desc="${presence}"]`,
            `//*[@name="${presence}"]`
        )
    }

    async groupName(groupName) {
        return basePage.getMobileSelector(
            `//android.view.ViewGroup[contains(@content-desc, "${groupName}")]`,
            `//XCUIElementTypeCell[contains(@name,"${groupName}")]`

        )
    }

    async groupConversationPreview(groupName, messageContent) {
        return basePage.getMobileSelector(
            `//android.widget.TextView[contains(@text, "${groupName}")]//following-sibling::*[contains(@text,'${messageContent}')]`,
            ``
        )
    }

    async deliveredSentMessageStatus(onDutyRoleName, messageContent) {
        return basePage.getMobileSelector(
            `//*[@text="${onDutyRoleName}"]//following-sibling::*[@text="${messageContent}"]`,
            `//XCUIElementTypeStaticText[contains(@value,'${onDutyRoleName}')]//ancestor::XCUIElementTypeOther//XCUIElementTypeStaticText[@name='${messageContent}']`
        )
    }

    async onDutyTextFromSettings(roleName) {
        return basePage.getMobileSelector(
            `//*[@text="${roleName}"]//following-sibling::*[@text="You're On Duty"]`,
            ``
        )
    }

    async conversationDetails() {
        return basePage.getMobileSelector(
            `//android.widget.ImageView[@content-desc="More options"]`,
            ``
        )
    }

    async conversationSettings() {
        return basePage.getMobileSelector(
            `//*[@text="Settings"]`,
            ``
        )
    }

    async goBackFromConversationSettings() {
        return basePage.getMobileSelector(
            `//*[@resource-id ="com.tigertext:id/conversation_details_toolbar"]//child::*[@class="android.widget.ImageButton"]`,
            ``
        )
    }

    async closeConversation() {
        return basePage.getMobileSelector(
            await this.findByContentDescAndroid('Back'),
            '~back-button'
        )
    }

    async messengerPageBadgeCount(badgeCount) {
        return basePage.getMobileSelector(
            `//*[@text='Messages']/following-sibling::*[@text='${badgeCount}']`,
            ``
        )
    }

    async messageContent(message) {
        return basePage.getMobileSelector(
            `//*[@text='${message}']`,
            await this.findByNameIOS(`${message}`)
        );
    }

    async sendingAsRoleText(roleName) {
        return basePage.getMobileSelector(
            `//*[@text='Sending as: ${roleName}']`,
            await this.findByNameIOS('Sending as: '+`${roleName}`)
        );
    }

    async appNotificationSelectors(notificationText) {
        return basePage.getMobileSelector(
            await this.findByTextAndResourceIdAndroid(notificationText, 'android:id/text'),
            await this.findByStaticContainsTextIOS(notificationText)
        )
    }
}

module.exports = MessengerHome
