package com.itechart.security.web.model.smg;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URL;

@Data
public class SmgResponse {

    public String ErrorCode;
    public String Permission;

    public static <T extends SmgResponse> T getResponse(URL requestUrl, Class<T> aClass) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        T response = mapper.readValue(
            requestUrl, aClass);
        if (!StringUtils.isEmpty(response.getErrorCode())) {
            throw new RuntimeException(response.getErrorCode());
        }
        return response;
    }
}
