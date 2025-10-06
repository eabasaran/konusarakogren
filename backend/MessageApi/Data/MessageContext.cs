using Microsoft.EntityFrameworkCore;
using MessageApi.Models;

namespace MessageApi.Data
{
    public class MessageContext : DbContext
    {
        public MessageContext(DbContextOptions<MessageContext> options) : base(options) { }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nickname).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.SentAt).IsRequired();
                entity.Property(e => e.SentimentLabel).HasMaxLength(50);
            });
        }
    }
}
