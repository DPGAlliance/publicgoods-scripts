package APIScripts;

import io.restassured.RestAssured;
import io.restassured.http.Method;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.json.JSONObject;
import org.junit.Test;

public class listDpgs {
    @Test
    public void list(){
        RestAssured.baseURI = "https://api.digitalpublicgoods.net/dpgs";
        RequestSpecification httpRequest = RestAssured.given();
        Response response = httpRequest.request(Method.GET);
        response.prettyPrint();
    }


    //JsonPath jpathReq=response.jsonPath();
    //        JSONObject jsonReq = new JSONObject(response.getBody().asString());
    //        int id=jsonReq.getJSONObject("data").getInt("id");
    @Test
    public void listofDpgs(){
        RestAssured.baseURI = "https://api.digitalpublicgoods.net/dpgs";
        RequestSpecification httpRequest = RestAssured.given();
        Response response = httpRequest.request(Method.GET);
        JsonPath jpathReq=response.jsonPath();
        JSONObject jsonReq = new JSONObject(response.getBody().asString());
        int names =jsonReq.getJSONObject("data").getInt("name");
        response.prettyPrint();
    }


}


