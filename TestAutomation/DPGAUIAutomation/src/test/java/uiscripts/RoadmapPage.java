package uiscripts;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.Reporter;
import org.testng.annotations.Test;
import utilities.BrowserConfig;
import org.openqa.selenium.interactions.*;

import static utilities.BrowserConfig.driver;

public class RoadmapPage {

    @Test
    public void NavigationRoadmapPage(){
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/roadmap");
        By WelcomenoteRoadmap = By.xpath("//*[@id=\"main\"]/div/header/h1");
        String Text = driver.findElement(WelcomenoteRoadmap).getText();
        System.out.println(Text);
        String ExpectedText="Roadmap";
        Assert.assertEquals(ExpectedText, Text);
        Reporter.log("Successfully Roadmap page Loaded");
        BrowserConfig.quitDriver();
    }

    @Test
    public void NavigationHomepagetoRegistryPage() throws InterruptedException {
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/");
        driver.manage().window().maximize();
        WebElement DpgDropdown= driver.findElement(By.xpath("//a[text()=\"What We Do\"]"));
        //Creating object of an Actions class
        Actions action = new Actions(driver);
        action.moveToElement(DpgDropdown).perform();
        By ByRegistryButton=By.xpath("//a[text()=\"Roadmap\"]");
        driver.findElement(ByRegistryButton).click();
        By WelcomenoteRoadmap = By.xpath("//*[@id=\"main\"]/div/header/h1");
        String Text = driver.findElement(WelcomenoteRoadmap).getText();
        System.out.println(Text);
        Assert.assertEquals(Text, "Roadmap");
        Reporter.log("Successfully navigated to Roadmap page from homepage");
        BrowserConfig.quitDriver();
    }



    @Test
    public void NavigationBacktoHomepageFromRoadmap() throws InterruptedException{
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/roadmap");
        By HomeButton=By.xpath("//*[@id=\"header\"]/nav/div/a[1]/span/img");
        driver.findElement(HomeButton).click();
        By Welcomenote = By.xpath("/html/body/div/main/div/div/div[1]/div[2]/header/h1");
        String Text = driver.findElement(Welcomenote).getText();
        System.out.println(Text);
        String ExpectedWelcomeNote="Promoting digital public goods to create a more equitable world";
        Assert.assertEquals(ExpectedWelcomeNote, Text);
        Reporter.log("Successfully navigated to Homepage from Roadmap");
        BrowserConfig.quitDriver();

    }



}
