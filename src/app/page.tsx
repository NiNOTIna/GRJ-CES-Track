
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

export default function Home() {
  const [cesPoints, setCesPoints] = useState(10);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>("Volunteering at a local shelter");

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
          <CardDescription>View points earned for different activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedActivity(value as ActivityType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select activity" currentValue={selectedActivity} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(activityPoints).map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {activity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2">
            Points earned: {activityPoints[selectedActivity]}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
