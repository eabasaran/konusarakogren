namespace MessageApi.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public string? SentimentLabel { get; set; }  // POSITIVE, NEGATIVE, NEUTRAL
        public double? SentimentScore { get; set; }  // 0.0 - 1.0 confidence score
    }
}
