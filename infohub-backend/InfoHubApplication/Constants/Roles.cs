namespace InfoHubApplication.Constants
{
    public static class Roles
    {
        public const string User = "user";
        public const string Manager = "manager";
        public const string Admin = "admin";

        public static readonly string[] AllRoles = new[] { User, Manager, Admin };
    }
}
