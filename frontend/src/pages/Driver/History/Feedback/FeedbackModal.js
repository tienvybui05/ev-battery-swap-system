import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faXmark,
    faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import styles from "./FeedbackModal.module.css";

/* ========= ÁNH XẠ MÀU CHO SỐ SAO ========= */
const RATING_COLORS = {
    1: "#EF4444",    // Đỏ - Rất tệ
    2: "#F59E0B",    // Cam - Tệ
    3: "#dbea08",    // Vàng - Bình thường
    4: "#84CC16",    // Xanh lá - Tốt
    5: "#22C55E"     // Xanh lá đậm - Rất tốt
};

function FeedbackModal({
                           isOpen,
                           onClose,
                           transactionId,
                           stationName,
                           onFeedbackSubmitted
                       }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ===================== XỬ LÝ GỬI ĐÁNH GIÁ ===================== */
    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Vui lòng chọn số sao đánh giá!");
            return;
        }

        if (!comment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const feedbackData = {
                noiDung: comment,
                soSao: rating,
                ngayDanhGia: new Date().toISOString().split('T')[0],
                maLichDat: transactionId
            };

            const response = await fetch("/api/feedback-service/danhgia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                alert("✅ Đánh giá của bạn đã được gửi thành công!");
                resetForm();
                onFeedbackSubmitted();
                onClose();
            } else {
                throw new Error("Gửi đánh giá thất bại");
            }
        } catch (error) {
            console.error("❌ Lỗi khi gửi đánh giá:", error);
            alert("❌ Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ===================== RESET FORM ===================== */
    const resetForm = () => {
        setRating(0);
        setComment("");
        setHoverRating(0);
    };

    /* ===================== XỬ LÝ ĐÓNG MODAL ===================== */
    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>

                {/* ===== HEADER ===== */}
                <div className={styles.modalHeader}>
                    <h2>Đánh Giá Dịch Vụ</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* ===== BODY ===== */}
                <div className={styles.modalBody}>

                    {/* Thông tin giao dịch */}
                    <div className={styles.transactionInfo}>
                        <h3>{stationName}</h3>
                        <p>Mã giao dịch: #{transactionId}</p>
                    </div>

                    {/* Đánh giá sao */}
                    <div className={styles.ratingSection}>
                        <label className={styles.sectionLabel}>
                            Chất lượng dịch vụ:
                        </label>
                        <div className={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= (hoverRating || rating);
                                const currentColor = isActive
                                    ? RATING_COLORS[star]
                                    : "#D1D5DB";

                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        className={styles.starButton}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        disabled={isSubmitting}
                                    >
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            style={{ color: currentColor }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <div className={styles.ratingText}>
                            {rating > 0 ? (
                                <span style={{ color: RATING_COLORS[rating] }}>
                                    {rating} sao - {
                                    rating === 1 ? "Rất tệ" :
                                        rating === 2 ? "Tệ" :
                                            rating === 3 ? "Bình thường" :
                                                rating === 4 ? "Tốt" : "Rất tốt"
                                }
                                </span>
                            ) : (
                                "Chọn số sao để đánh giá"
                            )}
                        </div>
                    </div>

                    {/* Nhận xét */}
                    <div className={styles.commentSection}>
                        <label className={styles.sectionLabel}>
                            Nhận xét của bạn:
                        </label>
                        <textarea
                            className={styles.commentInput}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Hãy chia sẻ trải nghiệm của bạn về dịch vụ thay pin..."
                            rows="4"
                            disabled={isSubmitting}
                        />
                        <div className={styles.charCount}>
                            {comment.length}/500 ký tự
                        </div>
                    </div>

                </div>

                {/* ===== FOOTER ===== */}
                <div className={styles.modalFooter}>
                    <button
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                        Hủy
                    </button>

                    <button
                        className={`${styles.button} ${styles.primaryButton}`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className={styles.spinner}></div>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Gửi đánh giá
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FeedbackModal;