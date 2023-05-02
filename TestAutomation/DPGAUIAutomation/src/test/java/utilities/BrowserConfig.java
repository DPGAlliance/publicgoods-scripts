package utilities;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.safari.SafariDriver;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

public class BrowserConfig {
    public static WebDriver driver;
    public static void setUpDriver(){


    
    //    WebDriverManager.safaridriver().setup();
    //    driver = new SafariDriver();





        // WebDriverManager.chromedriver().setup();
        // ChromeOptions co= new ChromeOptions();
        // co.addArguments("--remote-allow-origins=*");
        // driver = new ChromeDriver(co);

String downloadFilepath = System.getProperty("user.dir");
 WebDriverManager.chromedriver().setup();
 ChromeOptions chromeOptions;
 chromeOptions = new ChromeOptions();
 HashMap<String, Object> chromePrefs = new HashMap<String, Object>();
 chromePrefs.put("profile.default_content_settings.popups", 0);
 chromePrefs.put("download.default_directory", downloadFilepath);
 chromeOptions.addArguments("--no-sandbox");
 chromeOptions.addArguments("--disable-dev-shm-usage");
 chromeOptions.addArguments("--window-size=1325x744");
 chromeOptions.addArguments("--headless");chromeOptions.setExperimentalOption("prefs", chromePrefs);
 driver = new ChromeDriver(chromeOptions);
 driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);




        //headless chrome
        /*String downloadFilepath = System.getProperty("user.dir");
        WebDriverManager.chromedriver().setup();
        ChromeOptions chromeOptions;
        chromeOptions = new ChromeOptions();
        HashMap<String, Object> chromePrefs = new HashMap<String, Object>();
        chromePrefs.put("profile.default_content_settings.popups", 0);
        chromePrefs.put("download.default_directory", downloadFilepath);
        chromeOptions.addArguments("--headless");
        chromeOptions.addArguments("--whitelisted-ips");
        chromeOptions.addArguments("--no-sandbox");
        chromeOptions.addArguments("--disable-extensions");
        chromeOptions.addArguments("--remote-allow-origins=*");
        chromeOptions.addArguments("--headless", "--disable-gpu","--ignore-certificate-errors", "--disable-dev-shm-usage");
        chromeOptions.setExperimentalOption("prefs", chromePrefs);
        driver = new ChromeDriver(chromeOptions);
        driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS); */
        //ChromeOptions opts = new ChromeOptions();
        //opts.setExperimentalOption("prefs", prefs);
        //
        //driver = new ChromeDriver(opts);
    }

    public static void quitDriver() {
        driver.close();
        driver.quit();
    }

}
