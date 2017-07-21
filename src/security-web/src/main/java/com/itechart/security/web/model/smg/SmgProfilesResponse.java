package com.itechart.security.web.model.smg;

import com.itechart.security.web.model.dto.SmgProfileDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class SmgProfilesResponse extends SmgResponse {
    public List<SmgProfileDto> Profiles;
}
