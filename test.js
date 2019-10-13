const utils = require('./utils.js');
import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';

const sessionStorageSet = ClientFunction((key,val) => sessionStorage.setItem(key,val))

var testData = {
    customerFirstName : 'Arnold' + utils.RandomString(4),
    customerLastName : 'Rimmer' + utils.RandomString(4),
    customerEmail : utils.RandomString(8) + '@test.com',
    customerPassword: 'Pa$$w0rd',
    customerDateOfBirth: {
        day: '1',
        month: '4',
        year: '1989'
    },
    customerAddress: {
        lineOne : 'Red Dwarf',
        lineTwo : 'Salford',
        town : 'Manchester',
        postcode : 'M50 2BH'
    },
    customerTelephone: '07123456789',
    customerImage: './images/test.jpg',
    customerText: 'Up up up the ziggaraut\nlickety split!',
    customerMessage: 'Gazpacho soup is served cold!',
    card: {
        pan: '4444333322221111',
        expiryMonth: '2', // 1 for 3DS 2 for bypass
        expiryYear: '2021',
        cv2: '123'
    },
    recipientFirstName: 'Lexington',
    recipientLastName: 'Smithe',
    recipientTelephone: '07987654321'

}

console.log('Email used: ' + testData.customerEmail);

fixture `Getting Started`
    .page `https://uat-giftli-client.azurewebsites.net`;

test('New Customer - Happy Path', async t => {
    await sessionStorageSet('uiFlags', '{"hideStoryIntroModal": false}');
    // await console.log(await t.eval(() => sessionStorage.getItem('uiFlags')));
    await t
        //.setTestSpeed(0.8)
        .click('[data-test=CreateYourGiftcard]')
    var location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/recipient')
        .typeText('[data-test=recipientNameInput]', testData.recipientFirstName)
        .expect(Selector('[data-test=recipientNameInput]').value).eql(testData.recipientFirstName)
        .click('[data-test=createStoryButton]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/story')
        .click('[data-test="StoryIntroModal-continue"]')
        .click('[data-test=EditStoryCoverPageButton]')
        .click('[class="indexstyle__DesignInner-sc-1vz59ug-2 ikHSnT"]')
        .click('[data-test="saveDesignChanges"]')
        .click('[data-test="AddNewStoryPage"]')
        .setFilesToUpload('[type="file"]', testData.customerImage)
        .wait(2000)
        .typeText('[data-test="storyTextContentDiv"]', testData.customerText)
        .click('[data-test="IAmDoneEditingButton"]')
        .click('[data-test="addGiftcardAnchor"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/giftcard')
        .click('[data-test="giftcardValue-10"]')
        .click('[data-test="addMessageAnchor"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/gifttag')
        .typeText('[label="Add your gift tag message"]', testData.customerMessage)
        .typeText('[data-test="senderNameInput"]', testData.customerFirstName + ' ' + testData.customerLastName)
        .click('[data-test="previewButton"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/date')
        .click('[data-test="StoryOpenDate-previewButton"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('preview')
        .click('[data-test="StoryPreviewWrapper-goToCheckout"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/start')
        .typeText('[data-test="RegistrationStep1Form-emailInput"]', testData.customerEmail)
        .typeText('[data-test="RegistrationStep1Form-passwordInput"]', testData.customerPassword)
        .click('[data-test="RegistrationStep1Form-submit"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/add-personal-details')
    var titleSelect = Selector('[data-test="PersonalDetailsForm-titleInput"]')
    var titleOption = titleSelect.find('option')
    var daySelect = Selector('[data-test="SimpleDatePicker-dayInput"]')
    var dayOption = daySelect.find('option')
    var monthSelect = Selector('[data-test="SimpleDatePicker-monthInput"]')
    var monthOption = monthSelect.find('option')
    var yearSelect = Selector('[data-test="SimpleDatePicker-yearInput"]')
    var yearOption = yearSelect.find('option')
    await t
        .click(titleSelect)
        .click(titleOption.withExactText('Mr'))
        .expect(titleSelect.value).eql('Mr')
        .typeText('[data-test="PersonalDetailsForm-firstNameInput"]', testData.customerFirstName)
        .typeText('[data-test="PersonalDetailsForm-lastNameInput"]', testData.customerLastName)
        .click(daySelect)
        .click(dayOption.withExactText(testData.customerDateOfBirth.day))
        .expect(daySelect.value).eql(testData.customerDateOfBirth.day)
        .click(monthSelect)
        .click(monthOption.withExactText(testData.customerDateOfBirth.month))
        .expect(monthSelect.value).eql(testData.customerDateOfBirth.month)
        .click(yearSelect)
        .click(yearOption.withExactText(testData.customerDateOfBirth.year))
        .expect(yearSelect.value).eql(testData.customerDateOfBirth.year)
        .typeText('[data-test="PersonalDetailsForm-telephoneNumberInput"]', testData.customerTelephone)
        .expect( Selector('[data-test="PersonalDetailsForm-address_countrySelect"]').value).eql('United Kingdom')
        .typeText('[data-test="PersonalDetailsForm-address_line1Input"]', testData.customerAddress.lineOne)
        .typeText('[data-test="PersonalDetailsForm-address_line2Input"]', testData.customerAddress.lineTwo)
        .typeText('[data-test="PersonalDetailsForm-address_townInput"]', testData.customerAddress.town)
        .typeText('[data-test="PersonalDetailsForm-address_postcodeInput"]', testData.customerAddress.postcode)
        .click('[data-test="RegistrationStep2Form-submit"]')
        .wait(5000)
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/recipient')
        .typeText('[data-test="CheckoutRecipientDetailsForm-firstName"]', testData.recipientFirstName)
        .typeText('[data-test="CheckoutRecipientDetailsForm-lastName"]', testData.recipientLastName)
        .typeText('[data-test="CheckoutRecipientDetailsForm-mobileNumber"]', testData.recipientTelephone)
        .click('[data-test="CheckoutRecipientDetailsForm-submit"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/payment')
    var expiryMonthSelect = Selector('[data-test="CheckoutPaymentForm-expiryDateMonthInput"]');
    var expiryMonthOption = expiryMonthSelect.find('option');
    var expiryYearSelect = Selector('[data-test="CheckoutPaymentForm-expiryDateYearInput"]');
    var expiryYearOption = expiryYearSelect.find('option');
    await t
        .typeText('[data-test="CheckoutPaymentForm-cardNumberInput"]', testData.card.pan)
        .click(expiryMonthSelect)
        .click(expiryMonthOption.withExactText(testData.card.expiryMonth))
        .expect(expiryMonthSelect.value).eql(testData.card.expiryMonth)
        .click(expiryYearSelect)
        .click(expiryYearOption.withExactText(testData.card.expiryYear))
        .expect(expiryYearSelect.value).eql(testData.card.expiryYear)
        .typeText('[data-test="CheckoutPaymentForm-cv2Input"]', testData.card.cv2)
        .click('[data-test="CheckoutPaymentForm-submit"]')
        .wait(15000)
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/done')
});

test('Existing Customer - Happy Path', async t => {
    await sessionStorageSet('uiFlags', '{"hideStoryIntroModal": false}');
    // await console.log(await t.eval(() => sessionStorage.getItem('uiFlags')));
    await t
        //.setTestSpeed(0.8)
        .click('[data-test=CreateYourGiftcard]')
    var location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/recipient')
        .typeText('[data-test=recipientNameInput]', testData.recipientFirstName)
        .expect(Selector('[data-test=recipientNameInput]').value).eql(testData.recipientFirstName)
        .click('[data-test=createStoryButton]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/story')
        .click('[data-test="StoryIntroModal-continue"]')
        .click('[data-test=EditStoryCoverPageButton]')
        .click('[class="indexstyle__DesignInner-sc-1vz59ug-2 ikHSnT"]')
        .click('[data-test="saveDesignChanges"]')
        .click('[data-test="AddNewStoryPage"]')
        .setFilesToUpload('[type="file"]', testData.customerImage)
        .wait(2000)
        .typeText('[data-test="storyTextContentDiv"]', testData.customerText)
        .click('[data-test="IAmDoneEditingButton"]')
        .click('[data-test="addGiftcardAnchor"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/giftcard')
        .click('[data-test="giftcardValue-10"]')
        .click('[data-test="addMessageAnchor"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/gifttag')
        .typeText('[label="Add your gift tag message"]', testData.customerMessage)
        .typeText('[data-test="senderNameInput"]', testData.customerFirstName + ' ' + testData.customerLastName)
        .click('[data-test="previewButton"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('build/date')
        .click('[data-test="StoryOpenDate-previewButton"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('preview')
        .click('[data-test="StoryPreviewWrapper-goToCheckout"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/start')
        .click('[class="indexstyle__LinkCta-sc-1vwd5dm-0 fACtHK"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/login')
        .typeText('[data-test="LoginForm-emailAddressInput"]', testData.customerEmail)
        .typeText('[data-test="LoginForm-passwordInput"]', testData.customerPassword)
        .click('[data-test="LoginForm-submit"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/update-personal-details')
        .click('[data-test="UpdatePersonalDetails-submit"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/recipient')
        .typeText('[data-test="CheckoutRecipientDetailsForm-firstName"]', testData.recipientFirstName)
        .typeText('[data-test="CheckoutRecipientDetailsForm-lastName"]', testData.recipientLastName)
        .typeText('[data-test="CheckoutRecipientDetailsForm-mobileNumber"]', testData.recipientTelephone)
        .click('[data-test="CheckoutRecipientDetailsForm-submit"]')
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/payment')
    var expiryMonthSelect = Selector('[data-test="CheckoutPaymentForm-expiryDateMonthInput"]');
    var expiryMonthOption = expiryMonthSelect.find('option');
    var expiryYearSelect = Selector('[data-test="CheckoutPaymentForm-expiryDateYearInput"]');
    var expiryYearOption = expiryYearSelect.find('option');
    await t
        .typeText('[data-test="CheckoutPaymentForm-cardNumberInput"]', testData.card.pan)
        .click(expiryMonthSelect)
        .click(expiryMonthOption.withExactText(testData.card.expiryMonth))
        .expect(expiryMonthSelect.value).eql(testData.card.expiryMonth)
        .click(expiryYearSelect)
        .click(expiryYearOption.withExactText(testData.card.expiryYear))
        .expect(expiryYearSelect.value).eql(testData.card.expiryYear)
        .typeText('[data-test="CheckoutPaymentForm-cv2Input"]', testData.card.cv2)
        .click('[data-test="CheckoutPaymentForm-submit"]')
        .wait(15000)
    location = await t.eval(() => window.location)
    await t.expect(location.pathname).contains('checkout/done')

});
