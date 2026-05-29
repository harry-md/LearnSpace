package com.learnspace.learnspacebackend.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @NotNull
    @ColumnDefault("0.00")
    @Column(name = "usd_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal usdAmount;

    @NotNull
    @ColumnDefault("0.00")
    @Column(name = "vnd_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal vndAmount;

    @Size(max = 3)
    @ColumnDefault("'USD'")
    @Column(name = "currency", length = 10)
    private String currency = "USD";

    @Size(max = 3)
    @ColumnDefault("'VND'")
    @Column(name = "original_currency", length = 10)
    private String originalCurrency = "VND";

    @ColumnDefault("'PENDING'")
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    @Size(max = 100)
    @Column(name = "paypal_order_id", length = 100)
    private String paypalOrderId;

    @Size(max = 100)
    @Column(name = "paypal_capture_id", length = 100)
    private String paypalCaptureId;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Payment() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Enrollment getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(Enrollment enrollment) {
        this.enrollment = enrollment;
    }

    public BigDecimal getUsdAmount() {
        return usdAmount;
    }

    public void setUsdAmount(BigDecimal usdAmount) {
        this.usdAmount = usdAmount;
    }

    public BigDecimal getVndAmount() {
        return vndAmount;
    }

    public void setVndAmount(BigDecimal vndAmount) {
        this.vndAmount = vndAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getOriginalCurrency() {
        return originalCurrency;
    }

    public void setOriginalCurrency(String originalCurrency) {
        this.originalCurrency = originalCurrency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getPaypalOrderId() {
        return paypalOrderId;
    }

    public void setPaypalOrderId(String paypalOrderId) {
        this.paypalOrderId = paypalOrderId;
    }

    public String getPaypalCaptureId() {
        return paypalCaptureId;
    }

    public void setPaypalCaptureId(String paypalCaptureId) {
        this.paypalCaptureId = paypalCaptureId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
