package group4.backend.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private Resend resend;

    // send email to target user
    public void sendIssueStatusChangeEmail(String toEmail, String issueTitle, String oldStatus, String newStatus) {
        String subject = "Your issue status has been updated";
        String html = "<h2>Issue Status Update</h2>"
                + "<p>Your issue <strong>" + issueTitle + "</strong> status has been changed.</p>"
                + "<p>Previous status: <strong>" + oldStatus + "</strong></p>"
                + "<p>Current status: <strong>" + newStatus + "</strong></p>"
                + "<br><p>Thank you for your report.</p>";

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Issue Tracker <onboarding@resend.dev>")
                .to(toEmail)
                .subject(subject)
                .html(html)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("Email sent successfully, id: " + response.getId());
        } catch (ResendException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
