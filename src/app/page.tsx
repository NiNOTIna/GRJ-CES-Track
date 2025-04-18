"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import * as pako from 'pako'; // Import pako library

const CES_POINTS_REQUIRED = 60;

interface Activity {
    id: string;
    activityName: string;
    date: Date;
    role: string;
    points: number;
    isNonDiscipline: boolean;
    fileUrls: string[]; // Add fileUrls property
    iSawThat: string;
    iHeardThat: string;
    withWhatIExperiencedIWill: string;
    iFeltThat: string;
    iThoughtThat: string;
    overallRating: string;
}

// Points Matrix Data
const roleOptions = [
  { value: "member", label: "Member/Assistant Volunteer", points: 3 },
  { value: "speaker", label: "Speaker/Facilitator", points: 5 },
  { value: "leader", label: "Leader/Coordinator", points: 7 },
];

const recipientOptions = [
  { value: "communities", label: "Communities", points: 4 },
  { value: "organizations", label: "Organizations", points: 3 },
  { value: "institutions", label: "Institutions", points: 2 },
  { value: "others", label: "Others", points: 1 },
];

const approachOptions = [
  { value: "transformatory", label: "Transformatory", points: 4 },
  { value: "project", label: "Project Development", points: 3 },
  { value: "conference", label: "Conference/Lecture/Webinar/Tutorial", points: 2 },
  { value: "welfare", label: "Welfare/Wellbeing", points: 1 },
];

const scopeOptions = [
  { value: "university", label: "University Wide", points: 4 },
  { value: "school", label: "School/InterDept", points: 3 },
  { value: "departmental", label: "Departmental", points: 2 },
  { value: "personal", label: "Personal", points: 1 },
];

const serviceOptions = [
  { value: "extra", label: "Extra Curricular", points: 4 },
  { value: "co", label: "Co Curricular", points: 3 },
];

// Define types for selected options
type RoleValue = "member" | "speaker" | "leader";
type RecipientValue = "communities" | "organizations" | "institutions" | "others";
type ApproachValue = "transformatory" | "project" | "conference" | "welfare";
type ScopeValue = "university" | "school" | "departmental" | "personal";
type ServiceValue = "extra" | "co";

interface PointsMatrixState {
  role: RoleValue | "";
  recipient: RecipientValue | "";
  approach: ApproachValue | "";
  scope: ScopeValue | "";
  service: ServiceValue | "";
  hours: number;
}

const initialPointsMatrixState: PointsMatrixState = {
  role: "",
  recipient: "",
  approach: "",
  scope: "",
  service: "",
  hours: 0,
};


export default function Home() {
  const [cesPoints, setCesPoints] = useState(0);
  const [disciplinePoints, setDisciplinePoints] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [disciplinePointsInput, setDisciplinePointsInput] = useState(0);
  const [pointsMatrix, setPointsMatrix] = useState<PointsMatrixState>(initialPointsMatrixState);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [titleOfActivity, setTitleOfActivity] = useState("");
  const [iSawThat, setISawThat] = useState("");
  const [iHeardThat, setIHeardThat] = useState("");
  const [withWhatIExperiencedIWill, setWithWhatIExperiencedIWill] = useState("");
  const [iFeltThat, setIFeltThat] = useState("");
  const [role, setRole] = useState("");
  const [iThoughtThat, setIThoughtThat] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [activityHistory, setActivityHistory] = useState<Activity[]>([]);
  const [nonDisciplineActivity, setNonDisciplineActivity] = useState(false);
  const [nonDisciplinePointsInput, setNonDisciplinePointsInput] = useState(0);

  useEffect(() => {
    // Load activity history from local storage on component mount
    const storedHistory = localStorage.getItem('activityHistory');
    if (storedHistory) {
      setActivityHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    // Save activity history to local storage whenever it changes
    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));

    // Recalculate CES points whenever activity history changes
    let newCesPoints = 0;
    let newDisciplinePoints = 0;

    activityHistory.forEach(activity => {
      newCesPoints += activity.points;
      if (!activity.isNonDiscipline) {
        newDisciplinePoints += activity.points;
      }
    });

    setCesPoints(newCesPoints);
    setDisciplinePoints(newDisciplinePoints);
  }, [activityHistory]);


  const nonDisciplinePoints = cesPoints - disciplinePoints;
  const progress = (cesPoints / CES_POINTS_REQUIRED) * 100;


  const handleActivitySubmit = async () => {
      const fileUrls: string[] = [];

        if (proofFiles.length > 0) {
            for (const file of proofFiles) {
                // In a real application, you would upload the file to a server or cloud storage
                // and get a URL. For this example, we'll use a FileReader to read the file
                // and store it as a data URL.

                const fileUrl = await readFileAsDataURL(file);
                fileUrls.push(fileUrl);
            }
        }

      const points = nonDisciplineActivity ? nonDisciplinePointsInput : totalPoints;

      const newActivity: Activity = {
        id: crypto.randomUUID(),
        activityName: titleOfActivity,
        date: selectedDate || new Date(),
        role: role,
        points: points,
        isNonDiscipline: nonDisciplineActivity,
        fileUrls: fileUrls,
          iSawThat: iSawThat,
          iHeardThat: iHeardThat,
          withWhatIExperiencedIWill: withWhatIExperiencedIWill,
          iFeltThat: iFeltThat,
          iThoughtThat: iThoughtThat,
          overallRating: overallRating,
      };

    setActivityHistory([...activityHistory, newActivity]);


    // Placeholder for activity submission logic
    console.log("Activity submitted:", {
      activityName,
      activityDescription,
      proofFiles,
      selectedDate, // Include selectedDate in the submission
      titleOfActivity,
      iSawThat,
      iHeardThat,
      withWhatIExperiencedIWill,
      iFeltThat,
      iThoughtThat,
      overallRating,
      points: totalPoints,
      isNonDiscipline: nonDisciplineActivity, // Log the value of isNonDiscipline
      fileUrls: fileUrls,
        overallRating
    });
    // Reset form fields after submission
    setActivityName("");
    setActivityDescription("");
    setProofFiles([]);
    setSelectedDate(undefined);
    setTitleOfActivity("");
    setISawThat("");
    setIHeardThat("");
    setWithWhatIExperiencedIWill("");
    setIFeltThat("");
    setIThoughtThat("");
    setOverallRating("");
    setRole("");
    setNonDisciplineActivity(false);
    setNonDisciplinePointsInput(0); // Reset non-discipline points input
    toast({
      title: "Activity submitted!",
      description: "Your activity has been submitted for review.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofFiles(Array.from(e.target.files));
    }
  };


  const calculateTotalPoints = () => {
    // Check if any of the select options are empty
    if (!pointsMatrix.role || !pointsMatrix.recipient || !pointsMatrix.approach || !pointsMatrix.scope || !pointsMatrix.service) {
      return 0; // Return 0 if any option is not selected
    }

    const rolePoints = roleOptions.find((option) => option.value === pointsMatrix.role)?.points || 0;
    const recipientPoints = recipientOptions.find((option) => option.value === pointsMatrix.recipient)?.points || 0;
    const approachPoints = approachOptions.find((option) => option.value === pointsMatrix.approach)?.points || 0;
    const scopePoints = scopeOptions.find((option) => option.value === pointsMatrix.scope)?.points || 0;
    const servicePoints = serviceOptions.find((option) => option.value === pointsMatrix.service)?.points || 0;

    return ((rolePoints + recipientPoints + approachPoints + scopePoints + servicePoints)/2 + pointsMatrix.hours/2);
  };

  const totalPoints = calculateTotalPoints();

    const handlePointsMatrixChange = (key: keyof PointsMatrixState, value: string) => {
        if (key === "hours") {
            // Parse the value as a number when it's the "hours" field
            setPointsMatrix((prev) => ({...prev, [key]: parseInt(value, 10) || 0}));
        } else {
            // Otherwise, treat it as a string
            setPointsMatrix((prev) => ({...prev, [key]: value}));
        }
    };


  const { toast } = useToast();

    const handleDeleteActivity = (id: string) => {
        const activityToDelete = activityHistory.find(activity => activity.id === id);

        if (activityToDelete) {
            // Subtract the points from the total CES points
            setCesPoints(cesPoints - activityToDelete.points);

            // If it's a discipline activity, also subtract from discipline points
            if (!activityToDelete.isNonDiscipline) {
                setDisciplinePoints(disciplinePoints - activityToDelete.points);
            }
        }
        setActivityHistory(activityHistory.filter(activity => activity.id !== id));
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    resolve(event.target.result);
                } else {
                    reject(new Error('Failed to read file as data URL'));
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

  const handleExportData = () => {
      const dataStr = JSON.stringify(activityHistory);
      const compressedData = pako.deflate(dataStr, {to: 'string'});
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(compressedData);

      const exportFileDefaultName = 'activityData.json';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const compressedData = event.target?.result as string;
        const dataStr = pako.inflate(compressedData, {to: 'string'});
        const jsonData = JSON.parse(dataStr);
        setActivityHistory(jsonData);
        localStorage.setItem('activityHistory', JSON.stringify(jsonData));
      } catch (error) {
        alert('Error parsing JSON');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }


  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>CES Points Progress</CardTitle>
          <CardDescription>This tracker is not affiliated with the USC CES Office. The records of the University will always be used over what is recorded on this tracker.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cesPoints} Points</div>
          <Progress value={progress} className="mt-4" />
          <div className="text-sm mt-2">{cesPoints} / {CES_POINTS_REQUIRED} Points</div>
        </CardContent>
        <CardHeader>
          <CardTitle>Points Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="flex items-center space-x-2">
                <div>Non Discipline pts</div>
                <div>{nonDisciplinePoints} / 18</div>
            </div>
            <div className="flex items-center space-x-2">
                <div>Discipline Pts</div>
                  <div>{disciplinePoints}</div>
            </div>
            <div className="flex items-center space-x-2">
                <div>Total Points</div>
                <div>{cesPoints} / {CES_POINTS_REQUIRED}</div>
            </div>
        </CardContent>
      </Card>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Submit Activity</CardTitle>
            <CardDescription>Keep a record of your participation.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="titleOfActivity">Name of Activity</Label>
                    <Input
                        type="text"
                        id="titleOfActivity"
                        value={titleOfActivity}
                        onChange={(e) => setTitleOfActivity(e.target.value)}
                    />
                </div>
              <div>
                  <Label htmlFor="date">Date of Activity</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                              variant={"outline"}
                              className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !selectedDate && "text-muted-foreground"
                              )}
                          >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                          <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                          />
                      </PopoverContent>
                  </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="role">Role in Activity</Label>
                    <Input
                        type="text"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="proofUpload">Upload Documentation</Label>
                    <Input
                        type="file"
                        id="proofUpload"
                        multiple
                        accept="image/png, image/jpg, image/jpeg, image/webp"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
              {proofFiles.length > 0 && (
                <div className="mt-2">
                  <p>Uploaded files:</p>
                  <ul>
                    {proofFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4">
                <Label htmlFor="nonDiscipline">
                    <Checkbox
                        id="nonDiscipline"
                        checked={nonDisciplineActivity}
                        onCheckedChange={(checked) => {
                            setNonDisciplineActivity(!!checked);
                        }}
                    />
                    <span className="pl-2">Non-Discipline Activity</span>
                </Label>

                {nonDisciplineActivity && (
                    <div>
                        <Label htmlFor="nonDisciplinePoints">Add Non-Discipline Points (Max 10):</Label>
                        <Input
                            type="number"
                            id="nonDisciplinePoints"
                            value={nonDisciplinePointsInput}
                            onChange={(e) => {
                                const value = Math.max(0, Math.min(10, parseInt(e.target.value)));
                                setNonDisciplinePointsInput(isNaN(value) ? 0 : value);
                            }}
                            max={10}
                        />
                    </div>
                )}
            </div>


            <div>
              <Label htmlFor="iSawThat">I saw that...</Label>
              <Textarea
                id="iSawThat"
                value={iSawThat}
                onChange={(e) => setISawThat(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="iHeardThat">I heard that...</Label>
              <Textarea
                id="iHeardThat"
                value={iHeardThat}
                onChange={(e) => setIHeardThat(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="withWhatIExperiencedIWill">With what I experienced, I will...</Label>
              <Textarea
                id="withWhatIExperiencedIWill"
                value={withWhatIExperiencedIWill}
                onChange={(e) => setWithWhatIExperiencedIWill(e.target.value)}
              />
            </div>

              <div>
                  <Label htmlFor="iThoughtThat">The exposure activity made me think that...</Label>
                  <Textarea
                      id="iThoughtThat"
                      value={iThoughtThat}
                      onChange={(e) => setIThoughtThat(e.target.value)}
                  />
              </div>

            <div>
              <Label htmlFor="iFeltThat">I felt that...</Label>
              <Textarea
                id="iFeltThat"
                value={iFeltThat}
                onChange={(e) => setIFeltThat(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="overallRating">What is your overall rating to the CES Exposure Activity?</Label>
              <Select onValueChange={(value) => setOverallRating(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rating" currentValue={overallRating} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Angry">Angry</SelectItem>
                  <SelectItem value="Disappointed">Disappointed</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Love">Love</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleActivitySubmit} className="bg-teal-500 text-white hover:bg-teal-700">
              Submit Activity
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-4 md:mt-0">
          <CardHeader>
            <CardTitle>CES Points Calculator</CardTitle>
            <CardDescription>See how many CES points you can earn.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => handlePointsMatrixChange("role", value)} disabled={nonDisciplineActivity}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select role" currentValue={pointsMatrix.role} />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Select onValueChange={(value) => handlePointsMatrixChange("recipient", value)} disabled={nonDisciplineActivity}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select recipient" currentValue={pointsMatrix.recipient} />
                </SelectTrigger>
                <SelectContent>
                  {recipientOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="approach">Approach</Label>
              <Select onValueChange={(value) => handlePointsMatrixChange("approach", value)} disabled={nonDisciplineActivity}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select approach" currentValue={pointsMatrix.approach} />
                </SelectTrigger>
                <SelectContent>
                  {approachOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scope">Scope</Label>
              <Select onValueChange={(value) => handlePointsMatrixChange("scope", value)} disabled={nonDisciplineActivity}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select scope" currentValue={pointsMatrix.scope} />
                </SelectTrigger>
                <SelectContent>
                  {scopeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service">Nature of Service</Label>
              <Select onValueChange={(value) => handlePointsMatrixChange("service", value)} disabled={nonDisciplineActivity}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select nature of service" currentValue={pointsMatrix.service} />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hours">Hours</Label>
              <Input
                type="number"
                id="hours"
                value={pointsMatrix.hours}
                onChange={(e) => handlePointsMatrixChange("hours", e.target.value)}
                disabled={nonDisciplineActivity}
              />
            </div>

            <div className="mt-2">
              Total points for this activity: {totalPoints}
            </div>
          </CardContent>
        </Card>
      </div>
        <div className="flex mt-4 space-x-2">
            <Button onClick={handleExportData}>Export Data</Button>
            <Input type="file" accept=".json" onChange={handleImportData} />
        </div>
        <div>
            <h2>Activity History</h2>
            {activityHistory.length === 0 ? (
                <p>No activities submitted yet.</p>
            ) : (
                <div className="grid gap-4">
                    {activityHistory.map((activity) => (
                        <Card key={activity.id}>
                            <CardHeader>
                                <CardTitle>{activity.activityName}</CardTitle>
                                <CardDescription>
                                    Date: {format(activity.date, "PPP")} | Role: {activity.role} | Points: {activity.points} | Non-Discipline: {activity.isNonDiscipline ? "Yes" : "No"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value={activity.id}>
                                        <AccordionTrigger>View Submission Details</AccordionTrigger>
                                        <AccordionContent>
                                            <p><strong>I saw that:</strong> {activity.iSawThat}</p>
                                            <p><strong>I heard that:</strong> {activity.iHeardThat}</p>
                                            <p><strong>With what I experienced, I will:</strong> {activity.withWhatIExperiencedIWill}</p>
                                            <p><strong>The exposure activity made me think that:</strong> {activity.iThoughtThat}</p>
                                            <p><strong>I felt that:</strong> {activity.iFeltThat}</p>
                                            <p><strong>Overall Rating:</strong> {activity.overallRating}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                {activity.fileUrls.length > 0 && (
                                    <div className="mb-4">
                                        <p className="font-medium">Uploaded Images:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {activity.fileUrls.map((url, index) => (
                                                <img key={index} src={url} alt={`Proof ${index + 1}`} className="max-w-[100px] max-h-[100px] rounded-md" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <Button onClick={() => handleDeleteActivity(activity.id)} variant="destructive" size="sm">Delete</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
