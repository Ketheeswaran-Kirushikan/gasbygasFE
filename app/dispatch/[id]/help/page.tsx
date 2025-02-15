import { Layout } from "@/components/dispatch/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a new request?</AccordionTrigger>
              <AccordionContent>
                To create a new request, navigate to the Requests page and click on the "New Request" button. Fill out the required information in the form and submit it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How can I view the delivery schedule?</AccordionTrigger>
              <AccordionContent>
                You can view the delivery schedule by going to the Schedule page. There, you'll find a calendar view of all scheduled deliveries and maintenance visits.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What do the different request statuses mean?</AccordionTrigger>
              <AccordionContent>
                Request statuses include: Pending (awaiting approval), Confirmed (approved and scheduled), and Rejected (not approved). You can see the status of each request in the Requests page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I generate a report?</AccordionTrigger>
              <AccordionContent>
                To generate a report, go to the Reports page. Select the type of report you want, specify the date range, and click on the "Generate Report" button. You can then view and download the report.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </Layout>
  )
}

