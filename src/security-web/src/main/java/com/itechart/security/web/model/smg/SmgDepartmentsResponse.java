package com.itechart.security.web.model.smg;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class SmgDepartmentsResponse extends SmgResponse {
    public List<SmgDepartment> Depts;
}
