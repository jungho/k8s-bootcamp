package ca.architech.todo.security;

import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationFilter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableOAuth2Sso
@EnableGlobalMethodSecurity(
    securedEnabled = true,
    prePostEnabled = true
)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private AADAuthenticationFilter aadAuthFilter;

    @Autowired
    private Base64AuthenticationFilter base64AuthFilter;

    private static final Log logger;

    static {
        logger = LogFactory.getLog(WebSecurityConfig.class);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/api/todos/healthcheck").permitAll();
        http.authorizeRequests().antMatchers("/api/todos/**").authenticated();

        http.logout().logoutSuccessUrl("/").permitAll();

        http.csrf().disable();

        http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(base64AuthFilter, AADAuthenticationFilter.class);
    }
}
