// File: src/main/java/com/yourcompany/yourproject/model/AuthRequest.java
package com.yourcompany.yourproject.model;

import java.io.Serializable;

public class AuthRequest implements Serializable {
    private static final long serialVersionUID = 5926468583005150707L;

    private String username;
    private String password;
    private String token;

    // 默认构造函数 for JSON Parsing
    public AuthRequest() {
    }

    public AuthRequest(String username, String password) {
        this.setUsername(username);
        this.setPassword(password);
    }

    public AuthRequest(String token) {
        this.setToken(token);
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

// File: src/main/java/com/yourcompany/yourproject/model/JwtAuthenticationData.java
package com.yourcompany.yourproject.model;

public class JwtAuthenticationData {
    private final String token;

    public JwtAuthenticationData(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}

// File: src/main/java/com/yourcompany/yourproject/security/AuthenticationStrategy.java
package com.yourcompany.yourproject.security;

import com.yourcompany.yourproject.model.Response;
import com.yourcompany.yourproject.model.AuthRequest;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

public interface AuthenticationStrategy {
    Response<?> authenticate(AuthRequest authRequest) throws Exception;
    void configure(HttpSecurity httpSecurity) throws Exception;
}

// File: src/main/java/com/yourcompany/yourproject/security/JwtAuthenticationStrategy.java
package com.yourcompany.yourproject.security;

import com.yourcompany.yourproject.model.Response;
import com.yourcompany.yourproject.model.AuthRequest;
import com.yourcompany.yourproject.model.JwtAuthenticationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Component("jwtAuthenticationStrategy")
public class JwtAuthenticationStrategy implements AuthenticationStrategy {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Override
    public Response<?> authenticate(AuthRequest authRequest) throws Exception {
        if (authRequest.getToken() != null && !authRequest.getToken().isEmpty()) {
            return validateToken(authRequest.getToken());
        } else {
            return authenticateWithCredentials(authRequest.getUsername(), authRequest.getPassword());
        }
    }

    private Response<?> authenticateWithCredentials(String username, String password) throws Exception {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String token = jwtTokenUtil.generateToken(userDetails);
        return Response.newSuccess(new JwtAuthenticationData(token));
    }

    private Response<?> validateToken(String token) {
        String username = jwtTokenUtil.getUsernameFromToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        
        if (jwtTokenUtil.validateToken(token, userDetails)) {
            String newToken = jwtTokenUtil.refreshToken(token);
            return Response.newSuccess(new JwtAuthenticationData(newToken));
        } else {
            return Response.newFail("Invalid token");
        }
    }

    @Override
    public void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable()
                .authorizeRequests().antMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}

// File: src/main/java/com/yourcompany/yourproject/security/NoAuthenticationStrategy.java
package com.yourcompany.yourproject.security;

import com.yourcompany.yourproject.model.Response;
import com.yourcompany.yourproject.model.AuthRequest;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.stereotype.Component;

@Component("noAuthenticationStrategy")
public class NoAuthenticationStrategy implements AuthenticationStrategy {
    @Override
    public Response<?> authenticate(AuthRequest authRequest) throws Exception {
        // 在无认证模式下，我们可以简单地返回一个成功响应
        // 您可以根据需要添加一些基本的验证逻辑
        return Response.newSuccess(null);
    }

    @Override
    public void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable()
                .authorizeRequests()
                .anyRequest().permitAll()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}

// File: src/main/java/com/yourcompany/yourproject/config/SecurityConfig.java
package com.yourcompany.yourproject.config;

import com.yourcompany.yourproject.security.AuthenticationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private Environment env;

    @Autowired
    @Qualifier("jwtAuthenticationStrategy")
    private AuthenticationStrategy jwtAuthenticationStrategy;

    @Autowired
    @Qualifier("noAuthenticationStrategy")
    private AuthenticationStrategy noAuthenticationStrategy;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        boolean jwtEnabled = Boolean.parseBoolean(env.getProperty("jwt.enabled", "false"));
        if (jwtEnabled) {
            jwtAuthenticationStrategy.configure(httpSecurity);
        } else {
            noAuthenticationStrategy.configure(httpSecurity);
        }
    }

    @Bean
    public AuthenticationStrategy authenticationStrategy() {
        boolean jwtEnabled = Boolean.parseBoolean(env.getProperty("jwt.enabled", "false"));
        return jwtEnabled ? jwtAuthenticationStrategy : noAuthenticationStrategy;
    }
}

// File: src/main/java/com/yourcompany/yourproject/controller/auth/AuthController.java
package com.yourcompany.yourproject.controller.auth;

import com.yourcompany.yourproject.model.Response;
import com.yourcompany.yourproject.model.AuthRequest;
import com.yourcompany.yourproject.security.AuthenticationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationStrategy authenticationStrategy;

    @PostMapping("/authenticate")
    public ResponseEntity<Response<?>> authenticate(@RequestBody AuthRequest authRequest) throws Exception {
        Response<?> response = authenticationStrategy.authenticate(authRequest);
        return ResponseEntity.ok(response);
    }
}
