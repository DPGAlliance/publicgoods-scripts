package uiscripts;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.Reporter;
import org.testng.annotations.Test;
import utilities.BrowserConfig;
//import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;


import static utilities.BrowserConfig.driver;


public class DpgaPage {

    @Test
    public void Dpgasite(){
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/digital-public-goods/");
        By WelcomenoteRoadmap = By.xpath("//*[@id=\"main\"]/div/header/h1");
        String Text = driver.findElement(WelcomenoteRoadmap).getText();
        System.out.println(Text);
        String ExpectedText="Digital Public Goods";
        Assert.assertEquals(ExpectedText, Text);
        Reporter.log("Successfully DPGA Site Loaded");
        BrowserConfig.quitDriver();
    }

    @Test
    public void NavigationHomepagetoDpgaPage() throws InterruptedException {
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/");
        driver.manage().window().maximize();
        By DpgButton= By.xpath("//a[text()=\"Digital Public Goods\"]");
        driver.findElement(DpgButton).click();
        By WelcomenoteDpga = By.xpath("//*[@id=\"main\"]/div/header/h1");
        String Text = driver.findElement(WelcomenoteDpga).getText();
        System.out.println(Text);
        Assert.assertEquals(Text, "Digital Public Goods");
        Reporter.log("Successfully navigated to DPGA Site from Homepage");
        BrowserConfig.quitDriver();
    }



    @Test
    public void NavigationBacktoHomepageFromDpgaPage() throws InterruptedException{
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/digital-public-goods/");
        By HomeButton=By.xpath("//*[@id=\"header\"]/nav/div/a[1]/span/img");
        driver.findElement(HomeButton).click();
        By Welcomenote = By.xpath("/html/body/div/main/div/div/div[1]/div[2]/header/h1");
        String Text = driver.findElement(Welcomenote).getText();
        System.out.println(Text);
        String ExpectedWelcomeNote="Promoting digital public goods to create a more equitable world";
        Assert.assertTrue(Text.equals(ExpectedWelcomeNote));
        Reporter.log("Successfully Navigated back from DPGA Site to Homepage");
        BrowserConfig.quitDriver();

    }



}

