package com.hcl.capstoneserver.file;

import com.hcl.capstoneserver.file.entities.UploadedFile;
import com.hcl.capstoneserver.file.exceptions.UploadedFileInvalidTokenException;
import com.hcl.capstoneserver.file.exceptions.UploadedFileNotFoundException;
import com.hcl.capstoneserver.file.repositories.UploadedFileRepository;
import com.hcl.capstoneserver.util.TokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class UploadedFileService {
    @Autowired
    private UploadedFileRepository uploadedFileRepository;

    @Autowired
    private TokenGenerator tokenGenerator;

    @Autowired
    private FileStorageService fileStorageService;

    public UploadedFile createInitialFile(String fileName) {
        UploadedFile uploadedFile = new UploadedFile();
        uploadedFile.setUploaded(false);
        uploadedFile.setUri(fileName);
        uploadedFile.setToken(tokenGenerator.generateToken());

        uploadedFileRepository.save(uploadedFile);
        return uploadedFile;
    }

    public String uploadFile(Integer id, String token, MultipartFile file) {
        Optional<UploadedFile> uploadedFileObject = uploadedFileRepository.findById(id);

        // check if file exists
        if (!uploadedFileObject.isPresent()) {
            throw new UploadedFileNotFoundException(id);
        }

        //check token
        if (uploadedFileObject.get().getToken() == null || !uploadedFileObject.get().getToken().equals(token)) {
            throw new UploadedFileInvalidTokenException();
        }

        String[] splittedName = file.getOriginalFilename().split("\\.");
        // save file
        fileStorageService.save(
                file,
                String.format(
                        "%s.%s",
                        uploadedFileObject.get().getUri(),
                        splittedName[splittedName.length - 1]
                )
        );

        //update database
        uploadedFileObject.get().setToken("");
        uploadedFileObject.get().setUploaded(true);
        uploadedFileObject.get().setUri(id.toString());
        uploadedFileRepository.save(uploadedFileObject.get());


        return uploadedFileObject.get().getUri();
    }
}