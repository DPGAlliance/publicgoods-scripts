package APIScripts;

import io.restassured.RestAssured;
import io.restassured.http.Method;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.json.JSONObject;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DpgaListCall {
    @Test
    public void Test() {
        RestAssured.baseURI = "https://reqres.in/api/unknown/2";
        RequestSpecification httpRequest = RestAssured.given();
        Response response = httpRequest.request(Method.GET);
        //SingleResponse res = response.getBody().as(SingleResponse.class);
        /*response.getBody().asString()*/
        JsonPath jpathReq=response.jsonPath();
        JSONObject jsonReq = new JSONObject(response.getBody().asString());
        int id=jsonReq.getJSONObject("data").getInt("id");
        System.out.println(id);
        Assert.assertEquals(id,2);
        System.out.println((Integer)jpathReq.get("data.id"));
        Assert.assertEquals((Integer)jpathReq.get("data.id"),2);

        /*Assert.assertEquals(res.data.id,2);
        Assert.assertEquals(res.data.name,"fuchsia rose");
        Assert.assertEquals(res.data.year,2001);*/
    }

}
