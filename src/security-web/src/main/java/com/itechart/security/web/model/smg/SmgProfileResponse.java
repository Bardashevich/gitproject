package com.itechart.security.web.model.smg;


import com.itechart.security.web.model.dto.SmgProfileDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class SmgProfileResponse extends SmgResponse{
    public SmgProfileDto Profile;
}
