import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    
    @JsonIgnore
    private String password;
    
    // Getter and setter for password
    public void setPassword(String password) {
        this.password = password;
    }
    
    // No getter for password to prevent accidental exposure
    
    // Other getters and setters
}

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    // Other non-sensitive fields
}

public interface UserConverter {
    User toEntity(UserDTO dto);
    UserResponse toResponse(User entity);
    UserDTO toFullDTO(User entity);
    User updateEntity(User existingUser, UserDTO dto);
}

@Service
public class UserServiceImpl implements UserService {
    // ... other fields and dependencies
    
    @Override
    public UserResponse createUser(UserDTO userDTO) {
        User user = userConverter.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User savedUser = userRepository.save(user);
        return userConverter.toResponse(savedUser);
    }
    
    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return userConverter.toResponse(user);
    }
    
    @Override
    public UserResponse updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        User updatedUser = userConverter.updateEntity(existingUser, userDTO);
        if (userDTO.getPassword() != null) {
            updatedUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        User savedUser = userRepository.save(updatedUser);
        return userConverter.toResponse(savedUser);
    }
    
    // 仅在需要时使用的内部方法
    private UserDTO getFullUserDTO(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return userConverter.toFullDTO(user);
    }
}
