package com.itechart.security.business.filter;

import com.itechart.common.model.filter.TextFilter;
import com.itechart.security.business.model.persistent.Contact;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */

@Getter
@Setter
public class VacancyFilter extends TextFilter {

    private boolean showClosed;
    private Date displayedPeriodStart;
    private Date displayedPeriodEnd;
    private Contact hr;
    private Contact creator;
}
