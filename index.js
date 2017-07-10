const cred = require('./cred');
var promise = require('selenium-webdriver').promise;

//setup
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().window().maximize();

//click function
var clickingAll = () => {
	driver
		.findElements(
			webdriver.By.xpath('//i[@class="icon-s icon-checkbox pseudocheckbox "]')
		)
		.then(elements => {
			elements.map(elem => {
				elem.getAttribute('aria-checked').then(check => {
					if (check === 'true') {
						elem.click();
					}
				});
			});
		});
	driver
		.findElement(webdriver.By.xpath('//select[@class="j-selectbox"]'))
		.click();
	driver
		.findElement(webdriver.By.xpath('//option[@value="NO_RECEIVE"]'))
		.click();

	try {
		driver
			.findElement(webdriver.By.xpath('//option[@value="OFF]'))
			.then(null, err => {
				if (err) {
					return false;
				}
			})
			.click();
	} catch (e) {
		return false;
	}
	driver.navigate().back();
};

//actions
driver.get('https://secure.meetup.com/login/');

var mail = driver.findElement(webdriver.By.id('email'));
var pass = driver.findElement(webdriver.By.id('password'));

mail.sendKeys(cred.cred.user);
pass.sendKeys(cred.cred.pass);

driver.findElement(webdriver.By.name('submitButton')).click();
driver
	.findElement(
		webdriver.By.className(
			'valign--middle display--none atMedium_display--inline'
		)
	)
	.click();
driver.findElement(webdriver.By.xpath('//a[text()="Settings"]')).click();
driver.findElement(webdriver.By.xpath('//a[text()="Email Updates"]')).click();

const list = driver.findElements(
	webdriver.By.xpath('//li[@class="list-item"]/a')
);

list.then(function(elements) {
	var links = elements.map(elem => {
		return elem.getAttribute('href');
	});
	promise.all(links).then(linkRefs => {
		linkRefs.forEach(element => {
			driver.navigate().to(element);
			clickingAll();
		});
	});
});

driver.quit();
