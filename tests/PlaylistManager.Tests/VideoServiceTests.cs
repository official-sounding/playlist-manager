namespace PlaylistManager.Tests;

[TestClass]
public class VideoServiceTests
{
    private VideoService? svc;

    [TestInitialize]
    public void Setup() {

        svc = new VideoService(null, null);
    }

    [DataTestMethod]
    [DataRow("MGMT_-_Little_Dark_Age_Video-[rtL5oMyBHPs].mp4", "rtL5oMyBHPs")]
    [DataRow("MGMT_-_Little_Dark_Age_Video-[Official] [rtL5oMyBHPs].mp4", "rtL5oMyBHPs")]
    [DataRow("The Knife - Heartbeats (Official Video) [pPD8Ja64mRU].mp4", "pPD8Ja64mRU")]
    [DataRow("The Knife - Heartbeats (Official Video).mp4", null)]
    public void Test_ExtractIdFromFilename(string filename, string expected)
    {
        var result = svc?.ExtractIdFromFilename(filename);
        Assert.AreEqual(expected, result);
    }
}