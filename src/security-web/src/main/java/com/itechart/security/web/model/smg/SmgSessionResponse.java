package com.itechart.security.web.model.smg;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class SmgSessionResponse extends SmgResponse {
    public Integer SessionId;
}
