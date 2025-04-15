"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CES_POINTS_REQUIRED = 20;

const activityPoints = {
  "Volunteering at a local shelter": 5,
  "Participating in a community cleanup": 3,
  "Tutoring younger students": 7,
  "Assisting at a food bank": 4,
  "Mentoring underprivileged youth": 6,
};

type ActivityType = keyof typeof activityPoints;

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
  role: RoleValue;
  recipient: RecipientValue;
  approach: ApproachValue;
  scope: ScopeValue;
  service: ServiceValue;
}

const initialPointsMatrixState: PointsMatrixState = {
  role: "member",
  recipient: "communities",
  approach: "transformatory",
  scope: "university",
  service: "extra",
};


export default function Home() {
  const [cesPoints, setCesPoints] = useState(10);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>("Volunteering at a local shelter");

  // Points Matrix State
  const [pointsMatrix, setPointsMatrix] = useState<PointsMatrixState>(initialPointsMatrixState);

  const progress = (cesPoints / CES_POINTS_REQUIRED) * 100;

  const handleActivitySubmit = () => {
    // Placeholder for activity submission logic
    console.log("Activity submitted:", {
      activityName,
      activityDescription,
      proofFiles,
    });
    // Reset form fields after submission
    setActivityName("");
    setActivityDescription("");
    setProofFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofFiles(Array.from(e.target.files));
    }
  };


  const calculateTotalPoints = () => {
    const rolePoints = roleOptions.find((option) => option.value === pointsMatrix.role)?.points || 0;
    const recipientPoints = recipientOptions.find((option) => option.value === pointsMatrix.recipient)?.points || 0;
    const approachPoints = approachOptions.find((option) => option.value === pointsMatrix.approach)?.points || 0;
    const scopePoints = scopeOptions.find((option) => option.value === pointsMatrix.scope)?.points || 0;
    const servicePoints = serviceOptions.find((option) => option.value === pointsMatrix.service)?.points || 0;

    return rolePoints + recipientPoints + approachPoints + scopePoints + servicePoints;
  };

  const totalPoints = calculateTotalPoints();

  const handlePointsMatrixChange = (key: keyof PointsMatrixState, value: string) => {
    setPointsMatrix((prev) => ({ ...prev, [key]: value }));
  };


  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>CES Points</CardTitle>
          <CardDescription>Your accumulated Community Engagement Service points.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cesPoints} Points</div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Progress Tracker</CardTitle>
          <CardDescription>Track your progress towards graduation requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} />
          <div className="text-sm mt-2">{cesPoints} / {CES_POINTS_REQUIRED} Points</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Activity</CardTitle>
          <CardDescription>Enter details about your community service activity.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="activityName">Activity Name</Label>
            <Input
              type="text"
              id="activityName"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="activityDescription">Activity Description</Label>
            <Textarea
              id="activityDescription"
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="proofUpload">Upload Proof</Label>
            <Input
              type="file"
              id="proofUpload"
              multiple
              onChange={handleFileChange}
            />
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
          </div>
          <Button onClick={handleActivitySubmit} className="bg-teal-500 text-white hover:bg-teal-700">
            Submit Activity
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Points Matrix</CardTitle>
          <CardDescription>Select the options that best describe your activity.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => handlePointsMatrixChange("role", value)}>
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
            <Select onValueChange={(value) => handlePointsMatrixChange("recipient", value)}>
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
            <Select onValueChange={(value) => handlePointsMatrixChange("approach", value)}>
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
            <Select onValueChange={(value) => handlePointsMatrixChange("scope", value)}>
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
            <Select onValueChange={(value) => handlePointsMatrixChange("service", value)}>
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

          <div className="mt-2">
            Total points for this activity: {totalPoints}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
