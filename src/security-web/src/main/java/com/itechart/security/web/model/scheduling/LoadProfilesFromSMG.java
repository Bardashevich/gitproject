package com.itechart.security.web.model.scheduling;

import com.itechart.security.business.model.dto.SmgProfileShortDetailsDto;
import com.itechart.security.business.service.SmgProfileMapService;
import com.itechart.security.web.model.dto.SmgProfileDto;
import com.itechart.security.web.service.impl.SmgProfileServiceImpl;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Created by siarhei.rudzevich on 2/17/2017.
 */
@Component("loadProfilesFromSMG")
public class LoadProfilesFromSMG {

    private static final Logger logger = LoggerFactory.getLogger(LoadProfilesFromSMG.class);

    @Resource(name="applicationProperties")
    private Properties applicationProperties;

    @Autowired
    SmgProfileServiceImpl smgProfileServiceImpl;

    @Autowired
    SmgProfileMapService smgProfileMapService;

    public void loadProfilesFromSMG(){
        logger.info("Load profiles from SMG");
        String username = applicationProperties.getProperty("smg.username");
        String password = applicationProperties.getProperty("smg.password");
        List<SmgProfileDto> shortProfileList = new ArrayList<>();
        try{
            shortProfileList =  smgProfileServiceImpl.getAllSmgProfiles(username, password);
        }catch (IOException e){
            logger.error("Can't load profiles from smg", e);
        }
        if (CollectionUtils.isNotEmpty(shortProfileList)) {
            for (SmgProfileDto shortProfileDto : shortProfileList) {
                SmgProfileDto smgProfileDto = new SmgProfileDto();
                try {
                    smgProfileDto = smgProfileServiceImpl.getSmgProfileById(username, password, shortProfileDto.getProfileId());
                }catch (IOException e){
                    logger.error("Can't load profile from smg", e);
                }
                SmgProfileShortDetailsDto smgProfileShortDetailsDto = new SmgProfileShortDetailsDto();
                smgProfileShortDetailsDto.setId((long) smgProfileDto.getProfileId());
                smgProfileShortDetailsDto.setDomenName(smgProfileDto.getDomenName());
                SmgProfileShortDetailsDto answer = smgProfileMapService.get(smgProfileShortDetailsDto.getId());
                if (answer == null) {
                    smgProfileMapService.saveSmgProfile(smgProfileShortDetailsDto);
                }
            }
        }
    }

}
