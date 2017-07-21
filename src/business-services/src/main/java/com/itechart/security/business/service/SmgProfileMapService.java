package com.itechart.security.business.service;

import com.itechart.security.business.model.dto.SmgProfileShortDetailsDto;
import java.util.List;

/**
 * @author siarhei.rudzevich
 */
public interface SmgProfileMapService {

    Long saveSmgProfile(SmgProfileShortDetailsDto smgProfileDto);

    Integer getProfileIdByDomenName(String domenName);

    SmgProfileShortDetailsDto get(Long id);

    void deleteById(Long id);

    List<SmgProfileShortDetailsDto> getSmgProfileList();
}
