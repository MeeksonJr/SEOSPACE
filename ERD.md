# Entity-Relationship Diagram (ERD) — TrustPulse AI

```mermaid
erDiagram
    USERS ||--o{ WORKSPACES : owns
    WORKSPACES ||--o{ CAMPAIGNS : creates
    WORKSPACES ||--o{ REVIEWS : aggregates
    WORKSPACES ||--o{ PRIVATE_FEEDBACK : shields
    WORKSPACES ||--o{ WIDGET_CONFIGS : defines
    WORKSPACES ||--o| SUBSCRIPTIONS : billed_by
    REVIEWS ||--o{ AI_REPLIES : generates

    USERS {
        uuid id PK
        string email UK
        string full_name
        string role "owner | agency_admin | member"
        timestamp created_at
    }

    WORKSPACES {
        uuid id PK
        uuid owner_id FK
        string name "e.g. Apex Cosmetic Dental"
        string slug UK "apex-dental"
        string logo_url
        string brand_color "#6366f1"
        string google_place_id
        string google_review_url
        string trustpilot_url
        timestamp created_at
    }

    CAMPAIGNS {
        uuid id PK
        uuid workspace_id FK
        string name "Table Tent QR Booster"
        string qr_code_url
        int star_threshold "4 (>= 4 goes to Google, < 4 goes to private feedback)"
        string heading_text "How was your visit today?"
        string positive_cta "Share on Google"
        string negative_cta "Send Private Feedback"
        boolean active
        timestamp created_at
    }

    REVIEWS {
        uuid id PK
        uuid workspace_id FK
        string author_name "Sarah Mitchell"
        string author_avatar
        int rating "1 - 5"
        text review_text
        string platform "google | trustpilot | producthunt | direct"
        string sentiment "positive | neutral | negative"
        boolean is_featured "for Wall of Love"
        boolean is_verified
        timestamp review_date
        timestamp created_at
    }

    PRIVATE_FEEDBACK {
        uuid id PK
        uuid workspace_id FK
        uuid campaign_id FK
        int rating "1 - 3"
        string customer_name
        string customer_email
        string customer_phone
        text grievance_text
        string status "new | contacted | resolved"
        timestamp created_at
    }

    AI_REPLIES {
        uuid id PK
        uuid review_id FK
        string reply_type "seo_boosted | de_escalation | loyalty_reward"
        text content
        boolean is_approved
        timestamp generated_at
    }

    WIDGET_CONFIGS {
        uuid id PK
        uuid workspace_id FK
        string widget_type "wall_of_love | toast_notification | floating_pill | review_carousel"
        string theme "dark | light | glassmorphism"
        string position "bottom_left | bottom_right | embed"
        json display_rules "{ min_rating: 4, max_items: 20, loop_interval_seconds: 5 }"
        string custom_css
        timestamp updated_at
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid workspace_id FK
        string stripe_customer_id
        string stripe_subscription_id
        string plan_tier "starter | pro | agency"
        string status "active | past_due | trialing"
        timestamp current_period_end
    }
```

---

## Table Descriptions & Constraints

1. **`workspaces`**: Enables multi-tenancy. Agencies on the Agency Plan can create multiple workspaces for different clients (e.g. Dr. Thorne Dental, Miami Auto Care).
2. **`reviews`**: Holds all imported and captured reviews. Supports multi-platform attribution (Google, Trustpilot, Product Hunt, Direct).
3. **`private_feedback`**: Stores all 1 to 3 star shielded feedback so business owners can de-escalate directly without getting penalized on public review sites.
4. **`widget_configs`**: JSON-configurable settings for toast notifications, wall of love, and badges.
5. **`ai_replies`**: Stores PulseMind™ AI-generated response variations for quick 1-click copy to Google My Business.
