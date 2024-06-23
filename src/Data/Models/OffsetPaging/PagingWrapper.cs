namespace PlaylistManager.Data.Models.OffsetPaging;

public record PagingWrapper<T>(List<T> Data, PagingStatus Page, Links Links);

public record PagingStatus(int Offset, int Limit, int Length);

public record Links(Uri Self, Uri First, Uri? Next);