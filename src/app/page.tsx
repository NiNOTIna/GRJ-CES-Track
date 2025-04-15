
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

const CES_POINTS_REQUIRED = 20;

export default function Home() {
  const [cesPoints, setCesPoints] = useState(10);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);

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
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Activity</th>
                <th className="px-4 py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Volunteering at a local shelter</td>
                <td className="border px-4 py-2">5</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Participating in a community cleanup</td>
                <td className="border px-4 py-2">3</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Tutoring younger students</td>
                <td className="border px-4 py-2">7</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
