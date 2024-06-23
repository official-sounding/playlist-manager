using System.Web;
using PlaylistManager.Data.Models.OffsetPaging;

public class PagingService {

    public PagingWrapper<T> ApplyPaging<T>(IEnumerable<T> rawData, Uri selfUri, PagingRequest parameters) {
        var (offset, limit) = parameters;

        //taking limit + 1 to do next-page detection;
        var data = rawData.Skip(offset).Take(limit + 1).ToList();
        var hasNext = data.Count > limit;

        if (hasNext) {
            data = rawData.Take(limit).ToList();
        }

        var paging = new PagingStatus(offset, limit, data.Count);
        var links = BuildLinks(selfUri, paging, hasNext);

        return new (data, paging, links);
    }

    private Links BuildLinks(Uri selfUri, PagingStatus paging, bool hasNext) {
        // this gets all the query string key value pairs as a collection
        var newQueryString = HttpUtility.ParseQueryString(selfUri.Query);

        newQueryString.Remove("limit");
        newQueryString.Remove("offset");
        newQueryString.Add("limit", $"{paging.Limit}");

        var firstUri = new UriBuilder(selfUri.GetLeftPart(UriPartial.Path))
        {
            Query = newQueryString.ToString()
        };

        UriBuilder? nextUri = null;

        if(hasNext) {
            var nextOffset = paging.Offset + paging.Limit;
            newQueryString.Add("offset", $"{nextOffset}");

            nextUri = new UriBuilder(selfUri.GetLeftPart(UriPartial.Path))
            {
                Query = newQueryString.ToString()
            };
        }

        return new Links(selfUri, firstUri.Uri, nextUri?.Uri);
    }
}