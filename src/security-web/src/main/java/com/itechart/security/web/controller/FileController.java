package com.itechart.security.web.controller;

import com.itechart.security.business.service.FileService;
import com.itechart.security.web.util.FileUtil;
import com.itechart.security.web.util.TempFileUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "/files/contacts/{contactId}/attachments/{attachmentId}/{fileName}", method = GET)
    public void downloadAttachment(@PathVariable Long contactId, @PathVariable Long attachmentId, @PathVariable String fileName, HttpServletResponse response) {
        logger.debug("downloading attachment {} from contact {}", attachmentId, contactId);
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Disposition", "inline;filename*=UTF-8''" + fileName + ";");
        try {
            String mimeType = Files.probeContentType(new File(fileName).toPath());
            response.setContentType(mimeType);
            File file = fileService.getAttachment(contactId, attachmentId);
            FileUtil.copyFileToResponse(file, response);
        } catch (IOException ex) {
            logger.error("can't download attachment with id {} for contact {} in {}", attachmentId, contactId, ex);
            throw new RuntimeException("error happened during file download", ex);
        }
    }

    @RequestMapping(value = "/files", method = POST)
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            return TempFileUtil.saveTempFile(file.getInputStream());
        } catch (IOException e) {
            logger.error("can't upload file to server", e);
            throw new RuntimeException("file upload failed", e);
        }
    }

    @RequestMapping(value = "/files/download", method = GET)
    public void downloadFile(@RequestParam String path, @RequestParam String fileType, HttpServletResponse response){
        logger.debug("download file {} with type {}", path, fileType);
        response.setHeader("Cache-Control", "no-cache");
        String fileName = Paths.get(path).getFileName().toString().concat(".").concat(fileType);
        response.setHeader("Content-Disposition", "inline;filename*=UTF-8''" + fileName + ";");
        try {
            String mimeType = "application/" + fileType;
            response.setContentType(mimeType);
            File file = new File(path);
            InputStream in = new FileInputStream(file);
            FileCopyUtils.copy(in, response.getOutputStream());
        } catch (IOException ex) {
            logger.error("can't download file {} with type {} in {}", path, fileType, ex);
            throw new RuntimeException("error happened during file download", ex);
        }
    }
}
