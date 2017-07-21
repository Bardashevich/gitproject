package com.itechart.security.business.service.enums;

import lombok.Getter;

@Getter
public enum FileType {
    PDF("pdf"),
    XLS("xls"),
    DOCX("docx");
    private String value;

    public static FileType findByName(String filelType) {
        for (FileType tel : FileType.values()) {
            if (tel.name().equals(filelType)) {
                return tel;
            }
        }
        throw new RuntimeException("FileType was not found for name: " + filelType);
    }

    FileType(String value) {
        this.value = value;
    }
}
