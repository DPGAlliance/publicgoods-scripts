package uiscripts;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.Reporter;
import org.testng.annotations.Test;
import utilities.BrowserConfig;
import org.openqa.selenium.interactions.*;

import static utilities.BrowserConfig.driver;

public class RegistryPage {
    @Test
    public void NavigationRegistryPage(){
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/registry/");
        By WelcomenoteRegistry = By.xpath("//*[@id=\"main\"]/div/div/h1");
        String Text = driver.findElement(WelcomenoteRegistry).getText();
        System.out.println(Text);
        String ExpectedText="Registry";
        Assert.assertTrue(Text.equals(ExpectedText));
        Reporter.log("Successfully Registry Page is Loaded");
        BrowserConfig.quitDriver();
    }
    @Test
    public void NavigationHomepagetoRegistryPage() throws InterruptedException {
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/");
        driver.manage().window().maximize();
        WebElement DpgDropdown= driver.findElement(By.xpath("//a[text()=\"Digital Public Goods\"]"));
        //Creating object of an Actions class
        Actions action = new Actions(driver);
        //action.moveToElement(DpgDropdown).perform();

        action.moveToElement(DpgDropdown).perform();
        By ByRegistryButton=By.xpath("//a[text()=\"DPG Registry\"]");
        driver.findElement(ByRegistryButton).click();
        By WelcomenoteRegistry = By.xpath("//*[@id=\"main\"]/div/div/h1");
        String Text = driver.findElement(WelcomenoteRegistry).getText();
        System.out.println(Text);
        Assert.assertTrue(Text.equals("Registry"));
        Reporter.log("Successfully navigated to Registry page from Homepage");
        BrowserConfig.quitDriver();
    }





}
