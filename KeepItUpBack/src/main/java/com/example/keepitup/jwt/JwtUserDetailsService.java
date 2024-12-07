package com.example.keepitup.jwt;


import com.example.keepitup.model.entities.Users;
import com.example.keepitup.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {
    private final UsersRepository userDataRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userDataRepo.findByUsernameIgnoreCase(username)
                .or(() -> userDataRepo.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + username));

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .build();
    }
}