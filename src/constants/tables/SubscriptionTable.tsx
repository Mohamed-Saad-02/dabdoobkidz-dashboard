import Status from "../../components/common/Status";

export const SubscriptionTable = [
  {
    title: "Subscription ID",
    dataIndex: "id",
    key: "id",
  },
  {
    "title": "plan",
    render : (record : { plan : { name : string } }) => (
        <span>
            {record?.plan?.name}
        </span>
    )
  },
  {
    title: "Status",
    render: (record: { status: string }) => {
      let status = "info";
        if (record.status === "Active") {
            status = "success";
        } else if (record.status === "Inactive") {
            status = "error";
        } else if (record.status === "Pending") {
            status = "pending";
        }
      return (
        <p>
          <Status status={status} text={record.status} />
        </p>
      );
    },
  },
  {
    title : "User",
    render : (record : { user : { firstName : string, lastName : string }}) => (
        <p>{record?.user?.firstName} {record?.user?.lastName}</p>
    ),
    key : "user"
  },
  {
    title : "Renewal Date",
    render : (record : { renewalDate : string }) => {
        const date = new Date(record.renewalDate);
        return <p>{date.toDateString()}</p>
    },
  }

];
