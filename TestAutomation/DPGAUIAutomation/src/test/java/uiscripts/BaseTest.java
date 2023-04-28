package uiscripts;
import org.testng.Assert;
import org.testng.Reporter;
import org.testng.annotations.Test;
import utilities.BrowserConfig;
//import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.By;


import static utilities.BrowserConfig.driver;


public class BaseTest {
    @Test
    public void MainPage () throws Exception{
        BrowserConfig.setUpDriver();
        driver.get("https://dpgalliance.github.io/");
        driver.manage().window().maximize();
        By Welcomenote = By.xpath("/html/body/div/main/div/div/div[1]/div[2]/header/h1");
        String Text = driver.findElement(Welcomenote).getText();
        System.out.println(Text);
        String ExpectedWelcomeNote="Promoting digital public goods to create a more equitable world";
        Assert.assertTrue(Text.equals(ExpectedWelcomeNote));
        Reporter.log("Successfully Home Page is loaded");
        BrowserConfig.quitDriver();
    }
}
