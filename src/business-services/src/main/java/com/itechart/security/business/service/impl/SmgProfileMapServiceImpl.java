package com.itechart.security.business.service.impl;

import com.itechart.security.business.dao.SmgProfileDao;
import com.itechart.security.business.model.dto.SmgProfileShortDetailsDto;
import com.itechart.security.business.model.persistent.SmgProfileShortDetails;
import com.itechart.security.business.service.SmgProfileMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.itechart.security.business.model.dto.utils.DtoConverter.convert;
import static com.itechart.security.business.model.dto.utils.DtoConverter.convertSmgProfiles;

/**
 * @author siarhei.rudzevich
 */
@Service
public class SmgProfileMapServiceImpl implements SmgProfileMapService {

    @Autowired
    private SmgProfileDao smgProfileDao;

    @Override
    @Transactional
    public Long saveSmgProfile(SmgProfileShortDetailsDto smgProfileDto) {
        SmgProfileShortDetails smgProfile = convert(smgProfileDto);
        Long smgProfileId = smgProfileDao.save(smgProfile);
        return smgProfileId;
    }

    @Override
    @Transactional
    public Integer getProfileIdByDomenName(String domenName) {
        Integer profileId = smgProfileDao.getProfileIdByDomenName(domenName);
        return profileId;
    }

    @Override
    @Transactional(readOnly = true)
    public SmgProfileShortDetailsDto get(Long id) {
        SmgProfileShortDetailsDto SmgProfileDto = convert(smgProfileDao.get(id));
        return SmgProfileDto;
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        smgProfileDao.delete(id);
    }

    @Override
    @Transactional
    public List<SmgProfileShortDetailsDto> getSmgProfileList() {
        return convertSmgProfiles(smgProfileDao.loadAll());
    }

}
