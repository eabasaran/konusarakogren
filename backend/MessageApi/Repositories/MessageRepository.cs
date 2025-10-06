using Microsoft.EntityFrameworkCore;
using MessageApi.Data;
using MessageApi.Models;

namespace MessageApi.Repositories
{
    public class MessageRepository
    {
        private readonly MessageContext _context;

        public MessageRepository(MessageContext context)
        {
            _context = context;
        }

        public async Task<Message> AddAsync(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<Message> UpdateAsync(Message message)
        {
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<List<Message>> GetAllAsync()
        {
            return await _context.Messages
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<Message?> GetByIdAsync(int id)
        {
            return await _context.Messages.FindAsync(id);
        }
    }
}
