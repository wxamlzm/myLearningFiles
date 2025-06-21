// BaseAuthController.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class BaseAuthController {
    @Autowired
    protected AuthenticationManager authenticationManager;

    @Autowired
    protected JwtTokenUtil jwtTokenUtil;

    @Autowired
    protected JwtUserDetailsService userDetailsService;

    protected void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    protected String generateToken(UserDetails userDetails) {
        return jwtTokenUtil.generateToken(userDetails);
    }
}

// LoginController.java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController extends BaseAuthController {
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String token = generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token));
    }
}

// UserController.java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseAuthController {
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        // 实现获取用户资料的逻辑
        // 可以使用 userDetailsService 来获取当前认证用户的信息
        return ResponseEntity.ok("User profile data");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileDTO profileDTO) {
        // 实现更新用户资料的逻辑
        // 首先验证用户身份，然后更新资料
        return ResponseEntity.ok("Profile updated successfully");
    }
}
