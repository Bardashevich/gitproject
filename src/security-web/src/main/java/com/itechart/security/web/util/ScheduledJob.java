package com.itechart.security.web.util;

import com.itechart.security.web.model.scheduling.LoadProfilesFromSMG;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.quartz.QuartzJobBean;



/**
 * Created by siarhei.rudzevich on 2/17/2017.
 */
public class ScheduledJob extends QuartzJobBean {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledJob.class);

    private LoadProfilesFromSMG loadProfilesFromSMG;

    @Override
    protected void executeInternal(JobExecutionContext arg0)
            throws JobExecutionException {
        try{
            loadProfilesFromSMG.loadProfilesFromSMG();
        }catch (Exception e){
            logger.error("Can't load profiles from smg", e);
        }
    }

    public void setLoadProfilesFromSMG(LoadProfilesFromSMG loadProfilesFromSMG) {
        this.loadProfilesFromSMG = loadProfilesFromSMG;
    }

}
