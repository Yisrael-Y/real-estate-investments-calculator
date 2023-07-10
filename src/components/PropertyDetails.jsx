import React, { useEffect, useState } from "react";
import { Form, FloatingLabel, Table, Alert, Button } from "react-bootstrap";

function PropertyTable({ propertyData }) {
  const [switchState, setSwitchState] = useState(false);
  const [normalLoan, setNormalLoan] = useState(false);
  const [spitzerMortgage, setSpitzerMortgage] = useState(false);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [normalRevenue, setNormalRevenue] = useState(false);

  const years = [...new Set(propertyData.map((item) => item.year))];

  const months = [
    { month: 1, name: "January" },
    { month: 2, name: "February" },
    { month: 3, name: "March" },
    { month: 4, name: "April" },
    { month: 5, name: "May" },
    { month: 6, name: "June" },
    { month: 7, name: "July" },
    { month: 8, name: "August" },
    { month: 9, name: "September" },
    { month: 10, name: "October" },
    { month: 11, name: "November" },
    { month: 12, name: "December" },
  ];

  const calculatedRevenue = (property) => {
    const revenue = (
      property.nightly_price *
      property.occupancy_rate *
      30
    ).toFixed(2);
    return revenue;
  };

  const normalLoanRevenue = (property) => {
    const normalMortgageRevenue = amount / duration;
    const revenue = (
      property.nightly_price *
      property.occupancy_rate *
      30
    ).toFixed(2);
  
    const propertyYear = parseInt(property.year);
    const propertyMonth = parseInt(property.month);
    const endYear = parseInt(startYear) + Math.floor(duration / 12);
    const endMonth = parseInt(startMonth) + (duration % 12);
  
    if (
      propertyYear >= parseInt(startYear) &&
      propertyYear <= endYear &&
      (
        (propertyYear === parseInt(startYear) && propertyMonth >= parseInt(startMonth)) ||
        (propertyYear === endYear && propertyMonth <= endMonth) ||
        (propertyYear > parseInt(startYear) && propertyYear < endYear)
      )
    ) {
      return (revenue - normalMortgageRevenue).toFixed(2);
    } else {
      return "-";
    }
  };
  
  

  const handleMortgageChange = (event) => {
    const selectedLoanType = event.target.value;

    if (selectedLoanType === "1") {
      setNormalLoan(true);
      setSpitzerMortgage(false);
    } else if (selectedLoanType === "2") {
      setSpitzerMortgage(true);
      setNormalLoan(false);
    } else {
      setSpitzerMortgage(false);
      setNormalLoan(false);
    }
  };

  const handleStartYearChange = (event) => {
    const value = event.target.value;
    setStartYear(value);
  };

  const handleStartMonthChange = (event) => {
    const value = event.target.value;
    setStartMonth(value);
  };

  const handleNormalSubmit = () => {
    setNormalRevenue(true);
  };

  return (
    <div style={{ width: "20vw" }}>
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Add Loan Expenses"
          onChange={() => setSwitchState(!switchState)}
        />
        {switchState && (
          <>
            <Form.Select
              aria-label="Select type of loan"
              onChange={(e) => handleMortgageChange(e)}
            >
              <option>Select type of loan</option>
              <option value="1">Normal</option>
              <option value="2">Spitzer Mortgage</option>
            </Form.Select>
            {normalLoan && (
              <>
                <FloatingLabel controlId="amount" label="Amount">
                  <Form.Control
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </FloatingLabel>
                <FloatingLabel controlId="duration" label="Duration">
                  <Form.Control
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Enter duration"
                  />
                </FloatingLabel>
                <span>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => handleStartYearChange(e)}
                  >
                    <option>Select start year</option>
                    {years.map((year, index) => {
                      return (
                        <>
                          <option value={year}>{year}</option>
                        </>
                      );
                    })}
                  </Form.Select>
                </span>
                <span>
                  {" "}
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => handleStartMonthChange(e)}
                  >
                    <option>Select start month</option>
                    {months.map((month, index) => {
                      return (
                        <>
                          <option value={index + 1}>{month.name}</option>
                        </>
                      );
                    })}
                  </Form.Select>
                </span>
                <Button onClick={() => handleNormalSubmit()}>Submit</Button>
              </>
            )}
            {spitzerMortgage && (
              <Alert key="danger" variant="danger">
                This option is not yet available
              </Alert>
            )}
          </>
        )}
      </Form>
      <h3>Property Revenue</h3>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Year</th>
            {months.map((month, index) => (
              <th key={index}>{month.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year}>
              <td>{year}</td>
              {months.map((month) => (
                <td key={month.month}>
                  {propertyData.find((item) => {
                    return item.year == year && item.month == month.month;
                  })
                    ? calculatedRevenue(
                        propertyData.find(
                          (item) =>
                            item.year == year && item.month == month.month
                        )
                      )
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {normalRevenue && (
        <>
          <h3>Property revenue with loan payments for relavant months</h3>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Year</th>
                {months.map((month, index) => (
                  <th key={index}>{month.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map((year) => (
                <tr key={year}>
                  <td>{year}</td>
                  {months.map((month) => (
                    <td key={month.month}>
                      {propertyData.find((item) => {
                        return item.year == year && item.month == month.month;
                      })
                        ? normalLoanRevenue(
                            propertyData.find(
                              (item) =>
                              item.year == year && item.month == month.month
                              )
                          )
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

export default PropertyTable;
