namespace PlaylistManager.Data.Models.OffsetPaging;


public record PagingRequest(int offset = 0, int limit = 100);