package ca.architech.todo.security;

import ca.architech.todo.models.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.spring.autoconfigure.aad.UserGroup;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipal;
import com.nimbusds.jose.jwk.JWK;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@Component
public class Base64AuthenticationFilter extends OncePerRequestFilter {
    private static final String AUTHORIZATION_HEADER_NAME = "Authorization";
    private static final String BEARER_TOKEN_PREFIX = "Bearer";

    @Value("${api.todo.isTestMode:false}")
    private String isTestMode;

    private static final Log logger;

    static {
        logger = LogFactory.getLog(Base64AuthenticationFilter.class);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        HttpServletRequest requestToForward = request;
        String authToken = getAuthorizationHeader(request);

        if (Boolean.parseBoolean(isTestMode) && authToken != null) {
            logger.info("Using Base 64 authentication");
            User authenticatedUser = getUser(authToken);
            logger.info(String.format("Decoded user from Base 64 header - %s", authenticatedUser));

            UserPrincipal userPrincipal = new Base64AuthenticationUserPrincipal(authenticatedUser);
            Authentication authentication = new PreAuthenticatedAuthenticationToken(userPrincipal, null);
            authentication.setAuthenticated(true);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            requestToForward = removeAuthorizationHeader(request);

            logger.info(String.format("Authentication successful - %s", authenticatedUser));
        }
        filterChain.doFilter(requestToForward, response);
    }

    private String getAuthorizationHeader(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER_NAME);
        if (authHeader == null || !authHeader.startsWith(BEARER_TOKEN_PREFIX)) {
            return null;
        }

        return authHeader.replace(BEARER_TOKEN_PREFIX, "").trim();
    }

    private User getUser(String authToken) throws IOException {
        Base64.Decoder decoder = Base64.getDecoder();
        String serializedUser = new String(decoder.decode(authToken), "UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(serializedUser, User.class);
    }

    private HttpServletRequest removeAuthorizationHeader(HttpServletRequest request) {
        return new HttpServletRequestWrapper(request) {
            @Override
            public Enumeration<String> getHeaderNames() {
                Set<String> filteredNames = new HashSet<>();
                Enumeration<String> allHeaderNames = super.getHeaderNames();
                while (allHeaderNames.hasMoreElements()) {
                    String headerName = allHeaderNames.nextElement();
                    if (!headerName.equalsIgnoreCase(AUTHORIZATION_HEADER_NAME)) {
                        filteredNames.add(headerName);
                    }
                }
                return Collections.enumeration(filteredNames);
            }

            @Override
            public Enumeration<String> getHeaders(String name) {
                if (name.equalsIgnoreCase(AUTHORIZATION_HEADER_NAME)) {
                    return Collections.emptyEnumeration();
                }
                return super.getHeaders(name);
            }

            @Override
            public String getHeader(String name) {
                if (name.equalsIgnoreCase(AUTHORIZATION_HEADER_NAME)) {
                    return null;
                }
                return super.getHeader(name);
            }
        };
    }

    static final class Base64AuthenticationUserPrincipal extends UserPrincipal {
        private static final String KEY_EMAIL = "email";

        private final User user;

        private Base64AuthenticationUserPrincipal(User user) {
            this.user = user;
        }

        @Override
        public Map<String, Object> getClaims() {
            Map<String, Object> claims = new HashMap<String, Object>(1);
            claims.put(KEY_EMAIL, user.getEmail());
            return Collections.unmodifiableMap(claims);
        }

        @Override
        public String getIssuer() {
            throw new UnsupportedOperationException();
        }

        @Override
        public String getSubject() {
            throw new UnsupportedOperationException();
        }

        @Override
        public Object getClaim() {
            throw new UnsupportedOperationException();
        }

        @Override
        public String getKid() {
            throw new UnsupportedOperationException();
        }

        @Override
        public JWK getJWKByKid(String kid) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<UserGroup> getGroups(String graphApiToken) throws Exception {
            throw new UnsupportedOperationException();
        }

        @Override
        public boolean isMemberOf(UserGroup group) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<GrantedAuthority> getAuthoritiesByUserGroups(List<UserGroup> userGroups,
                                                                 List<String> targetdGroupNames) {
            throw new UnsupportedOperationException();
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            throw new UnsupportedOperationException();
        }

        @Override
        public Authentication getAuthentication() {
            throw new UnsupportedOperationException();
        }
    }
}
